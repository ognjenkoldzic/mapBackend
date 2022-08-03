import express from "express";
import Pin from "../models/Pin.js";
import multer from "multer";
import * as fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    //const urlEncodedName = encodeURIComponent(file.originalname);
    const splitup = file.originalname.split(".");
    const newFilename = Date.now() + "." + splitup[splitup.length - 1];
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("pinImage"), async (req, res) => {
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
    // imgName: req.body.name,
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename), //
      contentType: "image/png",
    },
  });

  try {
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

export default router;
