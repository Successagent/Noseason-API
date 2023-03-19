const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    headerDesc: { type: String, required: true },
    listType: { type: String, required: true },
    propertType: { type: String, required: true },
    measurementUnit: { type: String, required: true },
    image: { type: Array, required: true },
    landSize: { type: String, required: true },
    askingPrice: { type: Number, required: true },
    marketValue: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    available: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
