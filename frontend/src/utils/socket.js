import { io } from "socket.io-client";

const socket = io("https://smart-queueless-kz4a.onrender.com", {
  transports: ["websocket"],
});

export default socket;
