const Product = require("../models/Product");
const Admin = require("../models/Admin");
const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const { verifyTokenAdmin } = require("./verifyToken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

const saveProduct = async (product) => {
  const newProduct = new Product(product);
  const savedProduct = await newProduct.save();
  console.log(savedProduct);
  return savedProduct;
};

//add product
router.post("/", verifyTokenAdmin, upload.array("image"), async (req, res) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return result;
    });
    const uploadResults = await Promise.all(uploadPromises);
    const image = uploadResults.map((result) => {
      return { public_id: result.public_id, url: result.url };
    });
    const newProduct = { ...req.body, image: image };
    const savedProduct = await saveProduct(newProduct);
    console.log(savedProduct);
    res.json({
      message: "Images uploaded successfully",
      product: savedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//update product;
router.put("/update/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete product;
router.post("/delete/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all products;
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get product and user data;
router.get("/stats", verifyTokenAdmin, async (req, res) => {
  try {
    // return count of all users, products, orders in a single object
    const admin = await Admin.countDocuments({ isAdmin: false });
    const products = await Product.countDocuments();
    const data = {
      admin,
      products,
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
