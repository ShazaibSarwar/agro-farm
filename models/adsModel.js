const mongoose = require("mongoose");
const validator = require("validator");

const adsSchema = mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  //   required: [true, "User is required field"],
  // },
  title: {
    type: String,
    required: [true, "Ad must have a title"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    trim: true,
  },
  images: {
    type: Array,
    // required: [true, "A survey must have questions"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Ads = mongoose.model("Ads", adsSchema);
module.exports = Ads;
