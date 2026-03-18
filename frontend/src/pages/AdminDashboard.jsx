import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createQueue,
  deleteQueue,
  deleteToken,
  getQueues,
  getQueueDetails,
  serveNextToken,
  updateTokenStatus,
} from "../services/api";

const AdminDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueueId, setSelectedQueueId] = useState("");
  const [queueDetails, setQueueDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "Hospital",
    avgServiceTime: "",
  });

  const loadQueues = async (preserveSelection = true) => {
    try {
      const data = await getQueues();
      const queueList = Array.isArray(data) ? data : [];
      setQueues(queueList);

      if (queueList.length === 0) {
        setSelectedQueueId("");
        setQueueDetails(null);
        return;
      }

      if (preserveSelection && selectedQueueId) {
        const stillExists = queueList.find((q) => q._id === selectedQueueId);
        if (stillExists) {
          return;
        }
      }

      setSelectedQueueId(queueList[0]._id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load queues");
    }
  };

  const loadQueueDetails = async (queueId, showError = true) => {
    if (!queueId) {
      setQueueDetails(null);
      return;
    }

    try {
      const data = await getQueueDetails(queueId);
      setQueueDetails(data);
    } catch (error) {
      if (error?.response?.status === 404) {
        setQueueDetails(null);
        await loadQueues(false);
        return;
      }

      if (showError) {
        toast.error(
          error?.response?.data?.message || "Failed to load queue details",
        );
      }
    }
  };

  useEffect(() => {
    loadQueues(false);
  }, []);

  useEffect(() => {
    if (selectedQueueId) {
      loadQueueDetails(selectedQueueId, false);
    } else {
      setQueueDetails(null);
    }
  }, [selectedQueueId]);

  const handleCreateQueue = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createQueue({
        title: formData.title,
        location: formData.location,
        category: formData.category,
        avgServiceTime: Number(formData.avgServiceTime),
      });

      toast.success("Queue created successfully");

      setFormData({
        title: "",
        location: "",
        category: "Hospital",
        avgServiceTime: "",
      });

      await loadQueues(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create queue");
    } finally {
      setLoading(false);
    }
  };

  const handleServeNext = async () => {
    if (!selectedQueueId) return;

    try {
      await serveNextToken(selectedQueueId);
      toast.success("Serving next token");
      await loadQueueDetails(selectedQueueId, false);
      await loadQueues(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to serve next token",
      );
    }
  };

  const handleStatusChange = async (tokenId, status) => {
    try {
      await updateTokenStatus(tokenId, status);
      toast.success(`Token marked as ${status}`);
      await loadQueueDetails(selectedQueueId, false);
      await loadQueues(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update token status",
      );
    }
  };

  const handleDeleteToken = async (tokenId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this token?",
    );
    if (!confirmDelete) return;

    try {
      await deleteToken(tokenId);
      toast.success("Token deleted successfully");
      await loadQueueDetails(selectedQueueId, false);
      await loadQueues(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete token");
    }
  };

  const handleDeleteQueue = async (queueId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this queue? All tokens will also be removed.",
    );
    if (!confirmDelete) return;

    try {
      await deleteQueue(queueId);
      toast.success("Queue deleted successfully");

      const updatedQueues = queues.filter((q) => q._id !== queueId);
      setQueues(updatedQueues);

      if (selectedQueueId === queueId) {
        if (updatedQueues.length > 0) {
          setSelectedQueueId(updatedQueues[0]._id);
        } else {
          setSelectedQueueId("");
          setQueueDetails(null);
        }
      } else {
        await loadQueues(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete queue");
    }
  };

  return (
    <div className="container page-section">
      <div className="dashboard-layout">
        <div className="glass sidebar">
          <h2 className="sidebar-title">Admin Panel</h2>

          <div className="sidebar-links">
            {queues.map((queue) => (
              <button
                key={queue._id}
                className="sidebar-link"
                onClick={() => setSelectedQueueId(queue._id)}
                style={{
                  cursor: "pointer",
                  outline:
                    selectedQueueId === queue._id
                      ? "2px solid #4fd1c5"
                      : "none",
                }}
              >
                {queue.title}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-main">
          <div className="gradient-card" style={{ marginBottom: "20px" }}>
            <div className="gradient-card-inner">
              <h2 className="section-title">Create New Queue</h2>

              <form onSubmit={handleCreateQueue}>
                <div className="grid grid-2">
                  <div className="input-group">
                    <label>Queue Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Hospital OPD"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Kolhapur"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    >
                      <option value="Hospital">Hospital</option>
                      <option value="Bank">Bank</option>
                      <option value="College Office">College Office</option>
                      <option value="Government Office">
                        Government Office
                      </option>
                      <option value="Salon">Salon</option>
                      <option value="Clinic">Clinic</option>
                      <option value="Service Center">Service Center</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Average Service Time (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.avgServiceTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          avgServiceTime: e.target.value,
                        })
                      }
                      placeholder="10"
                      required
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Queue"}
                </button>
              </form>
            </div>
          </div>

          {queueDetails ? (
            <div className="gradient-card">
              <div className="gradient-card-inner">
                <div
                  className="row-between"
                  style={{ marginBottom: "18px", alignItems: "center" }}
                >
                  <div>
                    <h2 className="section-title">
                      {queueDetails.queue.title}
                    </h2>
                    <p className="small-text">
                      {queueDetails.queue.location} •{" "}
                      {queueDetails.queue.category}
                    </p>
                  </div>

                  <div className="queue-actions">
                    <button
                      className="btn btn-warning"
                      onClick={handleServeNext}
                    >
                      Serve Next
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteQueue(queueDetails.queue._id)}
                    >
                      Delete Queue
                    </button>
                  </div>
                </div>

                <div className="token-list">
                  {queueDetails.tokens?.length > 0 ? (
                    queueDetails.tokens.map((token) => (
                      <div className="token-item" key={token._id}>
                        <div>
                          <h4>
                            Token #{token.tokenNumber} -{" "}
                            {token.user?.name || "User"}
                          </h4>
                          <p className="small-text">{token.user?.email}</p>
                          <p className={`token-status ${token.status}`}>
                            {token.status}
                          </p>
                        </div>

                        <div className="token-actions">
                          <button
                            className="btn btn-muted"
                            onClick={() =>
                              handleStatusChange(token._id, "waiting")
                            }
                          >
                            Waiting
                          </button>

                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handleStatusChange(token._id, "serving")
                            }
                          >
                            Serving
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              handleStatusChange(token._id, "completed")
                            }
                          >
                            Complete
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              handleStatusChange(token._id, "cancelled")
                            }
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteToken(token._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-box glass">
                      No tokens in this queue right now.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-box glass">Select a queue to manage it.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
