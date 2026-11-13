import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dishagatashutosh_db_user:code1@cluster0.qogxxmu.mongodb.net/CodeQuest')
    .then (() =>{
        console.log("MongoDB connected successfully");
    })
}