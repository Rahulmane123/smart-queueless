import { Link, useNavigate } from "react-router-dom";
import { clearUserInfo } from "../utils/helpers";

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    clearUserInfo();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          Queue<span>Less AI</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/queues" className="nav-link">
            Queues
          </Link>

          {userInfo ? (
            <>
              {userInfo.role === "admin" ? (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              ) : (
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
              <button className="btn btn-danger" onClick={logoutHandler}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-muted">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
