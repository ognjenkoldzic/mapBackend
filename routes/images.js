// import express from "express";
// const router = express.Router();
// import ImageModel from "../models/ImageModel.js";
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads");
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     },
//   });

//   const upload = multer({ storage: storage });

//   app.post("/", upload.single("testImage"), (req, res) => {
//     const saveImage = ImageModel({
//       name: req.body.name,
//       img: {
//         data: fs.readFileSync("uploads/" + req.file.filename),
//         contentType: "image/png",
//       },
//     });
//     saveImage
//       .save()
//       .then((res) => {
//         console.log("image is saved");
//       })
//       .catch((err) => {
//         console.log(err, "error has occur");
//       });
//     res.send("image is saved");
//   });

//   app.get("/", async (req, res) => {
//     const allData = await ImageModel.find();
//     res.json(allData);
//   });

// export default router;
