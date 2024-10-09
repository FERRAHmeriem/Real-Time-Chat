const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes")
const app = express();
const socket = require("socket.io")
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth" , userRoutes);
app.use("/api/message" , messageRoutes);
const connect = ()=> {
    mongoose.connect(process.env.MONGO_ULR).then(() => console.log("connected to the database"))
}

const server = app.listen(process.env.PORT , ()=> {
    connect();
    console.log(`server started on port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data.message);
      }
    });
  });