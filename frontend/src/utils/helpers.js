// export const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo"));

// export const saveUserInfo = (data) => {
//   localStorage.setItem("userInfo", JSON.stringify(data));
// };

// export const clearUserInfo = () => {
//   localStorage.removeItem("userInfo");
// };

// export const calculateProgress = (tokenNumber, currentServingToken) => {
//   if (!tokenNumber || tokenNumber <= 0) return 0;
//   const served = Math.max(0, currentServingToken);
//   const progress = (served / tokenNumber) * 100;
//   return Math.min(100, Math.max(0, progress));
// };

// export const formatEta = (minutes) => {
//   if (minutes <= 0) return "Now";
//   if (minutes < 60) return `${minutes} min`;
//   const hrs = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${hrs}h ${mins}m`;
// };

//-------------------------------------------------------------------------------------
// // 🔐 USER STORAGE
// export const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo"));

// export const saveUserInfo = (data) => {
//   localStorage.setItem("userInfo", JSON.stringify(data));
// };

// export const clearUserInfo = () => {
//   localStorage.removeItem("userInfo");
// };

// // 🔥 FIXED PROGRESS CALCULATION
// export const calculateProgress = (tokenNumber, currentServingToken) => {
//   if (!tokenNumber || tokenNumber <= 0) return 0;

//   const served = Math.max(0, currentServingToken || 0);

//   // ✅ current serving ko include karne ke liye +1
//   const progress = ((served + 1) / tokenNumber) * 100;

//   // ✅ clamp between 0–100
//   return Math.min(100, Math.max(0, progress));
// };

// // ⏱️ FORMAT ETA (improved)
// export const formatEta = (minutes) => {
//   if (!minutes || minutes <= 0) return "Now";

//   if (minutes < 60) return `${minutes} min`;

//   const hrs = Math.floor(minutes / 60);
//   const mins = minutes % 60;

//   if (mins === 0) return `${hrs}h`;

//   return `${hrs}h ${mins}m`;
// };

//---------------------------------------------------------------------------------

// 🔥 Calculate queue progress (percentage)
export const calculateProgress = (tokenNumber, currentServingToken) => {
  if (!tokenNumber || tokenNumber <= 0) return 0;

  const served = currentServingToken || 0;

  // ✅ FIX: +1 to include current serving
  const progress = ((served + 1) / tokenNumber) * 100;

  return Math.min(100, Math.max(0, Math.floor(progress)));
};

// 🔥 Format ETA (minutes → readable)
export const formatEta = (minutes) => {
  if (!minutes || minutes <= 0) return "Now";

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
};

// 🔥 Get status color (for UI)
export const getStatusColor = (status) => {
  switch (status) {
    case "waiting":
      return "#60a5fa";
    case "serving":
      return "#facc15";
    case "completed":
      return "#22c55e";
    case "cancelled":
      return "#fb7185";
    default:
      return "#94a3b8";
  }
};

// 🔥 Capitalize first letter
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// 🔥 Safe number formatter
export const safeNumber = (num) => {
  if (!num || isNaN(num)) return 0;
  return num;
};
