const Product = require("../moduls/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const products = require("../data/products");

// setting dotenv file
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const seedProducts = async () => {
  try {
      await Product.deleteMany()
      console.log('Product are deleted');

      await Product.insertMany(products)
      console.log('All Product are added')
 
      process.exit()

  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
