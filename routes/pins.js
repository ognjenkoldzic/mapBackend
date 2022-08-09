import express from "express";
import Pin from "../models/Pin.js";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";
import cors from "cors";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     //const urlEncodedName = encodeURIComponent(file.originalname);
//     const splitup = file.originalname.split(".");
//     const newFilename = Date.now() + "." + splitup[splitup.length - 1];
//     cb(null, newFilename);
//   },
// });

// const upload = multer({ storage: storage });

router.post("/", upload.single("pinImage"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const newPin = new Pin({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      indoor: req.body.indoor,
      public_access: req.body.public_access,
      address: req.body.address,
      rating: req.body.rating,
      city: req.body.city,
      long: req.body.long,
      lat: req.body.lat,
      img_src: result.secure_url,
      cloudinary_id: result.public_id,
    });
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let newPin = await Pin.findById(req.params.id);

    await cloudinary.uploader.destroy(newPin.cloudinary_id);

    await Pin.deleteOne({ _id: newPin._id });
    res.json(Pin);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("pinImage"), async (req, res) => {
  try {
    let newPin = await Pin.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(newPin.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      name: req.body.name || newPin.name,
      type: req.body.type || newPin.type,
      description: req.body.description || newPin.description,
      indoor: req.body.indoor || newPin.indoor,
      public_access: req.body.public_access || newPin.public_access,
      address: req.body.address || newPin.address,
      rating: req.body.rating || newPin.rating,
      city: req.body.city || newPin.city,
      long: req.body.long || newPin.long,
      lat: req.body.lat || newPin.lat,
      img_src: result.secure_url || newPin.secure_url,
      cloudinary_id: result.public_id || newPin.public_id,
    };
    newPin = await Pin.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(newPin);
  } catch (err) {
    console.log(err);
  }
});

export default router;
