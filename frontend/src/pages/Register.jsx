import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import { saveUserInfo } from "../utils/helpers";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "", // 🔐 optional
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/register", formData);

      saveUserInfo(data);
      toast.success("Registration successful");

      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <h2 className="heading">Create Account</h2>
        <p className="subtext" style={{ marginBottom: 20 }}>
          Get started with QueueLess AI.
        </p>

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={changeHandler}
              required
            />
          </div>

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
              placeholder="Create password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </div>

          {/* 🔐 OPTIONAL ADMIN SECRET */}
          <div className="input-group">
            <label>Admin Secret (optional)</label>
            <input
              type="text"
              name="adminSecret"
              placeholder="Enter secret if admin"
              value={formData.adminSecret}
              onChange={changeHandler}
            />
          </div>

          <button className="btn btn-secondary" style={{ width: "100%" }}>
            Register
          </button>
        </form>

        <p className="small-text" style={{ marginTop: 16 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4fd1c5" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
