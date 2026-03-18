export const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo"));

export const saveUserInfo = (data) => {
  localStorage.setItem("userInfo", JSON.stringify(data));
};

export const clearUserInfo = () => {
  localStorage.removeItem("userInfo");
};

export const calculateProgress = (tokenNumber, currentServingToken) => {
  if (!tokenNumber || tokenNumber <= 0) return 0;
  const served = Math.max(0, currentServingToken);
  const progress = (served / tokenNumber) * 100;
  return Math.min(100, Math.max(0, progress));
};

export const formatEta = (minutes) => {
  if (minutes <= 0) return "Now";
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};
