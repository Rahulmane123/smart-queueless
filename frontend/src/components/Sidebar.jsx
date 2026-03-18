import { Link } from "react-router-dom";

const Sidebar = ({ isAdmin }) => {
  return (
    <aside className="glass sidebar">
      <h3 className="sidebar-title">
        {isAdmin ? "Admin Panel" : "User Panel"}
      </h3>

      <div className="sidebar-links">
        <Link to="/" className="sidebar-link">
          Home
        </Link>
        <Link to="/queues" className="sidebar-link">
          Queue Explorer
        </Link>
        {isAdmin ? (
          <Link to="/admin" className="sidebar-link">
            Admin Dashboard
          </Link>
        ) : (
          <Link to="/dashboard" className="sidebar-link">
            My Dashboard
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
