import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pinRoute from "./routes/pins.js";
import cors from "cors";
import multer from "multer";
import * as fs from "fs";
import * as path from "path";
import bodyParser from "body-parser";
import ImageModel from "./models/Image.js";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("imagesPage");
});

// app.post("/", upload.single("image"), (req, res, next) => {
//   let obj = {
//     name: req.body.name,
//     desc: req.body.desc,
//     img: {
//       data: fs.readFileSync(
//         path.join(__dirname + "/uploads/" + req.file.filename)
//       ),
//       contentType: "image/png",
//     },
//   };
//   imgModel.create(obj, (err, item) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // item.save();
//       res.redirect("/");
//     }
//   });
// });
app.post("/uploadPhoto", upload.single("myImage"), (req, res) => {
  const obj = {
    img: {
      data: fs.readFileSync(
        path.join("images" + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  const newImage = new ImageModel({
    image: obj.img,
  });
  newImage.save((err) => {
    err ? console.log(err) : res.redirect("/");
  });
});
app.get("/", (req, res) => {
  ImageModel.find({}, (err, images) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("imagesPage", { images: images });
    }
  });
});
app.use("/api/pins", pinRoute);

app.listen(port, () => console.log(`Server is listening on port ${port}.`));
