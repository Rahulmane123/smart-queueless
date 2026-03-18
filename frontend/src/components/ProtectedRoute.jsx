import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ❌ Not logged in
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Admin required but user is not admin
  if (adminOnly && userInfo.role !== "admin") {
    return <Navigate to="/dashboard" replace />; // ✅ FIX
  }

  return children;
};

export default ProtectedRoute;
