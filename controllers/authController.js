const User = require("../models/user");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary =require('cloudinary')

// Register a user  => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width: 150,
    crop: 'scale'
  })

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url
    },
    // avatar: {
    //   public_id: '61oXGZ60GfL_fixco9',
    //   url: 'https://res.cloudinary.com/bookit/image/upload/v1614877995/products/61oXGZ60GfL_fixco9.jpg'
    // },
  }); 

  // const token = user.getJwtToken();

  // res.status(201).json({
  //   success: true,
  //   token
  // });
  sendToken(user, 200, res);
});

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //cheks if email and password entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email &  password", 400));
  }

  //Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Emial or Password", 401));
  }

  //check  password is corret or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Emial or Password", 401));
  }

  sendToken(user, 200, res);
});

//Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new ErrorHandler("not fond any user with this email", 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecomme password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined);

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash the Url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password dose not match", 400));
  }

  //setup new password
  user.password = req.body.password;
  (user.resetPasswordToken = undefined), (user.resetPasswordExpire = undefined);

  await user.save();

  sendToken(user, 200, res);
});

//Get Logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//if user logined and wants to Change and Update password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

//Update user profile => /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
      name: req.body.name,
      email: req.body.email
  }

  // Update avatar
  if (req.body.avatar !== '') {
      const user = await User.findById(req.user.id)

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
          crop: "scale"
      })

      newUserData.avatar = {
          public_id: result.public_id,
          url: result.secure_url
      }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
  })

  res.status(200).json({
      success: true
  })
})

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});


//Admin Routes

//Get all users => /api/v1/admin/users
exports.allUser = catchAsyncErrors(async (req, res, next) => {

  const users = await User.find()

  res.status(200).json({
    success: true,
    users
  })

})

//get user details => /api/v1/admin/users:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user){
    next(new ErrorHandler(`Not found any user with this id:${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })
})


//Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true
    
  });
});


//delete user => /api/v1/admin/users:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user){
    next(new ErrorHandler(`Not found any user with this id:${req.params.id}`))
  }

  //remove avatar from cludnary pending

  await user.remove();

  res.status(200).json({
    success: true,
  })
})
