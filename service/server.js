import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import initialize from "./app.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
 
// Initialize App Middleware and Routes

initialize(app);
 

    // // Configure session middleware
    // app.use(
    //     session({
    //       secret: process.env.JWT_SECRET, // Replace with a strong secret
    //       resave: false,
    //       saveUninitialized: true,
    //       store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    //       cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    //     })
    //   );


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat: ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { io };

initialize(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
