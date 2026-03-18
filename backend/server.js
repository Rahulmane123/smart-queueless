const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const { setSocketInstance } = require("./controllers/queueController");

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

// ✅ ENABLE SOCKET
setSocketInstance(io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);

app.get("/", (req, res) => {
  res.send("QueueLess AI Backend Running...");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinQueueRoom", (queueId) => {
    socket.join(queueId);
    console.log(`Socket ${socket.id} joined room ${queueId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
