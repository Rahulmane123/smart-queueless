// import { io } from "socket.io-client";

// const socket = io("https://smart-queueless-kz4a.onrender.com", {
//   transports: ["websocket"],
// });

// export default socket;

//-------------------------------------------------------------------------

import { io } from "socket.io-client";

const socket = io("https://smart-queueless-kz4a.onrender.com", {
  transports: ["websocket"],
});

// 🔔 USER ROOM JOIN
export const joinUserRoom = (userId) => {
  socket.emit("joinUserRoom", userId);
};

export default socket;
