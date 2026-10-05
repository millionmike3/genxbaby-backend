import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import checksRouter from "./src/routes/checks";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/checks", checksRouter);

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});
