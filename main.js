import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pinRoute from "./routes/pins.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 8001;

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

app.use("/api/pins", pinRoute);

app.listen(port, () => console.log(`Server is listening on port ${port}.`));
