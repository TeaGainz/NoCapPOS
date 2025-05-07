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
    releaseYear: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    material: {
      type: String,
      required: false,
    },
    layoutStandard: {
      type: String,
      required: false,
    },
    subLegends: {
      type: String,
      required: false,
    },
    rgbShineThrough: {
      type: String,
      required: false,
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
      required: false,
    },
    altImage: {
      type: String,
      required: false,
    },
    imageRender1: {
      type: String,
      required: false,
    },
    imageRender2: {
      type: String,
      required: false,
    },
    imageRender3: {
      type: String,
      required: false,
    },
    imageRender4: {
      type: String,
      required: false,
    },
    imageRender5: {
      type: String,
      required: false,
    },
    imageRender6: {
      type: String,
      required: false,
    },
    isHighlighted:{
      type: Boolean,
      required: false,
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
