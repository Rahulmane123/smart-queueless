import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token to every request
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

// ==============================
// 🔥 QUEUE APIs
// ==============================

// ✅ Get queues (search + filter support)
export const getQueues = async (params = {}) => {
  const { data } = await API.get("/queues", { params });
  return data;
};

// ✅ Get single queue details
export const getQueueDetails = async (queueId) => {
  const { data } = await API.get(`/queues/${queueId}`);
  return data;
};

// ✅ Create queue (admin)
export const createQueue = async (queueData) => {
  const { data } = await API.post("/queues", queueData);
  return data;
};

// ✅ Join queue
export const joinQueue = async (queueId) => {
  const { data } = await API.post(`/queues/${queueId}/join`);
  return data;
};

// ✅ Serve next token (admin)
export const serveNextToken = async (queueId) => {
  const { data } = await API.post(`/queues/${queueId}/serve-next`);
  return data;
};

// ==============================
// 🔥 TOKEN APIs
// ==============================

// ✅ Update token status (admin)
export const updateTokenStatus = async (tokenId, status) => {
  const { data } = await API.put(`/queues/token/${tokenId}/status`, {
    status,
  });
  return data;
};

// ✅ Cancel token (user)
export const deleteToken = async (tokenId) => {
  const { data } = await API.delete(`/queues/token/${tokenId}`);
  return data;
};

// ==============================
// 🔥 ADMIN APIs
// ==============================

// ✅ Delete queue (admin)
export const deleteQueue = async (queueId) => {
  const { data } = await API.delete(`/queues/${queueId}`);
  return data;
};

// ==============================

export default API;
