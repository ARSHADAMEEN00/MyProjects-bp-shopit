const app = require( './app')
const connectDatabase = require('./config/database')
const dotenv =require('dotenv')
const cloudinary = require("cloudinary");

//Handle the Uncaught Exceptions
process.on('uncaughtException', err =>{
    console.log(`ERROR: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exceptions `)
    process.exit(1)
})

// setting config files
dotenv.config({ path: 'backend/config/config.env' })

//connecting to database
connectDatabase();

//Handle unhandle Promise rejections
process.on('unhandledRejection', err =>{
    console.log(`Error: ${err.stack}`);
    console.log(`Shutting down the server due to Unhandle Promise rejection`);
    server.close(() =>{
        process.exit(1)
    })
})

//setup cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server= app.listen(process.env.PORT, () => {
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})
