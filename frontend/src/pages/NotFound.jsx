import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="center-box">
      <div className="glass card" style={{ maxWidth: 500 }}>
        <h2 className="heading">404</h2>
        <p className="subtext" style={{ marginBottom: 20 }}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
