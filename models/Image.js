import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const ImageModel = new mongoose.model("Image", imageSchema);

export default ImageModel;
