const router = require("express").Router();
const Admin = require("../models/Admin");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/admin", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      res.status(401).json("Wrong credentials");
    } else if (admin) {
      const hashedPassword = CryptoJS.AES.decrypt(
        admin.password,
        process.env.PASS_SEC
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password) {
        res.status(401).json("Wrong credentials");
      } else {
        const accessToken = jwt.sign(
          {
            id: admin._id,
            isAdmin: admin.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );
        const { password, cpassword, ...others } = admin._doc;
        res.status(200).json({ ...others, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/adminRegister", async (req, res) => {
  const newAdmin = new Admin({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    cpassword: CryptoJS.AES.encrypt(
      req.body.cpassword,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
    console.log(savedAdmin);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//Login route;
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("Wrong credentials");
    } else if (user) {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password) {
        res.status(401).json("Wrong credentials");
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );
        const { password, cpassword, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
