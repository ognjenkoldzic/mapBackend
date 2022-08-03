import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pinRoute from "./routes/pins.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error.field);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//----------------------WORKING---------------------------

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/", upload.single("testImage"), (req, res) => {
//   const saveImage = ImageModel({
//     name: req.body.name,
//     img: {
//       data: fs.readFileSync("uploads/" + req.file.filename),
//       contentType: "image/png",
//     },
//   });
//   saveImage
//     .save()
//     .then((res) => {
//       console.log("image is saved");
//     })
//     .catch((err) => {
//       console.log(err, "error has occur");
//     });
//   res.send("image is saved");
// });

// app.get("/", async (req, res) => {
//   const allData = await ImageModel.find();
//   res.json(allData);
// });

app.use("/api/pins", pinRoute);

app.listen(port, () => console.log(`Server is listening on port ${port}.`));
