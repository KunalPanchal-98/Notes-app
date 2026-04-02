import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`[api] listening on http://localhost:${PORT}`);
  });
};

bootstrap();
