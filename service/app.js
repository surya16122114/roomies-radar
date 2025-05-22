import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import initializeRoutes from "./routes/index.js";

dotenv.config();


const initialize = (app) => {
    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Database Connection
    mongoose
        .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("MongoDB connection error:", err));

    // Initialize Routes
    initializeRoutes(app);
};


export default initialize;