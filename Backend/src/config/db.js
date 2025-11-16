import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://taguiamjohnalex_db_user:2tzy2Zqadt7k4XkY@cluster0.jslczr7.mongodb.net/?appName=Cluster0"
    );
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.error("Error Connecting to MongoDB", error);
  }
};
