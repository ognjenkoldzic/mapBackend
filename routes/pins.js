import express from "express";
const router = express.Router();
import Pin from "../models/Pin.js";
import multer from "multer";
import * as fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//create a pin
router.post("/", upload.single("testImage"), async (req, res) => {
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
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename),
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

//get all pins

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
