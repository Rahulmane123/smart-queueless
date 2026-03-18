import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { getQueues, joinQueue } from "../services/api";

const Queues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
  });

  // 🔥 LOAD QUEUES
  const loadQueues = async () => {
    try {
      setLoading(true);
      const data = await getQueues(filters);
      setQueues(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load queues");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DEBOUNCE SEARCH (IMPORTANT UX)
  useEffect(() => {
    const delay = setTimeout(() => {
      loadQueues();
    }, 400); // 400ms delay

    return () => clearTimeout(delay);
  }, [filters]);

  // 🔥 JOIN QUEUE
  const handleJoin = async (id) => {
    try {
      await joinQueue(id);
      toast.success("Joined queue successfully");
      loadQueues();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Join failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-top">
        <div>
          <h2 className="heading">Queue Explorer</h2>
          <p className="subtext">Search and join queues easily</p>
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="search-filter-bar">
        <input
          placeholder="Search queue..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <input
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Hospital">Hospital</option>
          <option value="Bank">Bank</option>
          <option value="College Office">College Office</option>
          <option value="Government Office">Government Office</option>
          <option value="Salon">Salon</option>
          <option value="Clinic">Clinic</option>
          <option value="Service Center">Service Center</option>
        </select>
      </div>

      {/* 🔥 LIST */}
      {loading ? (
        <div className="glass empty-box">Loading queues...</div>
      ) : queues.length === 0 ? (
        <div className="glass empty-box">No queues found.</div>
      ) : (
        <div className="grid grid-2">
          {queues.map((q) => (
            <div key={q._id} className="gradient-card">
              <div className="gradient-card-inner">
                <div className="queue-card-top">
                  <div>
                    <h3 className="queue-title">{q.title}</h3>
                    <p className="queue-meta">
                      {q.location} • {q.category}
                    </p>
                  </div>

                  <span
                    className={`status-pill ${
                      q.isOpen ? "status-open" : "status-closed"
                    }`}
                  >
                    {q.isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                <div style={{ marginTop: 14 }}>
                  <span className="info-chip">
                    Avg Time: {q.avgServiceTime} min
                  </span>
                  <span className="info-chip">
                    Now Serving: #{q.currentServingToken || 0}
                  </span>
                </div>

                <div className="queue-actions">
                  <button
                    className="btn btn-primary"
                    disabled={!q.isOpen}
                    onClick={() => handleJoin(q._id)}
                  >
                    Join Queue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Queues;
