import mongoose from "mongoose";

const keycapsSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    layoutStandard: {
      type: String,
      required: true,
    },
    subLegends: {
      type: String,
      required: true,
    },
    rgbShineThrough: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Keycaps = mongoose.model("Keycaps", keycapsSchema);

export default Keycaps;
