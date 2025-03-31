import mongoose from "mongoose";

//https://gist.github.com/rashidmya/2c075330e636134f00ebe85fbb88fed8
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  try {
    cached.conn = await mongoose.connect(process.env.MONGO_URL as string, {
      dbName: "DevDB",
    });
    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
export default connectDB;
