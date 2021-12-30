import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.once("open", () => console.log("✅ Connected to DB"));
db.on("error", () => console.log("⛔ DB error"));
