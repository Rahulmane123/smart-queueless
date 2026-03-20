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
// 🔐 USER STORAGE
export const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo"));

export const saveUserInfo = (data) => {
  localStorage.setItem("userInfo", JSON.stringify(data));
};

export const clearUserInfo = () => {
  localStorage.removeItem("userInfo");
};

// 🔥 FIXED PROGRESS CALCULATION
export const calculateProgress = (tokenNumber, currentServingToken) => {
  if (!tokenNumber || tokenNumber <= 0) return 0;

  const served = Math.max(0, currentServingToken || 0);

  // ✅ current serving ko include karne ke liye +1
  const progress = ((served + 1) / tokenNumber) * 100;

  // ✅ clamp between 0–100
  return Math.min(100, Math.max(0, progress));
};

// ⏱️ FORMAT ETA (improved)
export const formatEta = (minutes) => {
  if (!minutes || minutes <= 0) return "Now";

  if (minutes < 60) return `${minutes} min`;

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hrs}h`;

  return `${hrs}h ${mins}m`;
};
