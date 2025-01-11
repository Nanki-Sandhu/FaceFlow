import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
dotenv.config();
// Create an instance of Express app
const app = express();

// Create the HTTP server using the Express app instance
const server = createServer(app);

// Initialize Socket.io and pass the server to it
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 3001));

// Use middlewares

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);

// Start the server and connect to MongoDB
const start = async () => {
    // Establish a connection to MongoDB 
    const connectionDB = await mongoose.connect(process.env.MongoDB_URL);

    // Log the connection details if the database is successfully connected
    console.log(`Mongo connected DB Host: ${connectionDB.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("Listening at port 3001");
    });
}

start();