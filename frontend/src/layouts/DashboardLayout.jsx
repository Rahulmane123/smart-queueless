import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children, isAdmin = false }) => {
  return (
    <section className="page-section">
      <div className="container dashboard-layout">
        <Sidebar isAdmin={isAdmin} />
        <div className="dashboard-main">{children}</div>
      </div>
    </section>
  );
};

export default DashboardLayout;
