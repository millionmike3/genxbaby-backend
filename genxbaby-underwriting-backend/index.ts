import express from "express";
import cors from "cors";

import underwritingRouter from "./routes/underwriting";
import anchorRouter from "./routes/anchor";

const app = express();

app.use(cors());
app.use(express.json());

// Underwriting routes
app.use("/underwriting", underwritingRouter);

// Polygon anchoring route
app.use("/underwriting", anchorRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Underwriting backend running on port ${PORT}`);
  export default router;

});
