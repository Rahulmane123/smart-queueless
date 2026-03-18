import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import { saveUserInfo } from "../utils/helpers";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/login", formData);
      saveUserInfo(data);
      toast.success("Login successful");
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <h2 className="heading">Welcome Back</h2>
        <p className="subtext" style={{ marginBottom: 20 }}>
          Login to access your queue dashboard.
        </p>

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={changeHandler}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </div>

          <button className="btn btn-primary" style={{ width: "100%" }}>
            Login
          </button>
        </form>

        <p className="small-text" style={{ marginTop: 16 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#4fd1c5" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
