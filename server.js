const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");

dotenv.config();
const app = express();
const session = require("express-session");
app.use(
  session({
    key: "userid",
    secret: "subscribe",
    resave: false,
    saveUninitialized: true,
    save: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

//mongoose;
mongoose
.connect(process.env.MONGO_URL, { useNewUrlParser: true })
.then(() => {
  console.log("db connected successfully");
})
.catch((err) => {
  console.log(err);
});

//middleware;
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Life,Design,Code");
});
