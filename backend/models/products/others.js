import mongoose from "mongoose";

const othersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
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

const Others = mongoose.model("Others", othersSchema);

export default Others;
