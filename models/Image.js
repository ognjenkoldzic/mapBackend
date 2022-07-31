import mongoose from "mongoose";

const imgSchema = new mongoose.Schema({
  name: String,
  //desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const ImageModel = new mongoose.model("Image", imgSchema); //new?

export default ImageModel;
