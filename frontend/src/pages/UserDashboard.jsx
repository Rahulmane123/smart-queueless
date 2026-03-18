import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API, { deleteToken } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import socket from "../utils/socket";
import { calculateProgress, formatEta } from "../utils/helpers";

// 🔥 Animated Counter
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500;
    const stepTime = 20;
    const increment = Math.max(1, Math.ceil(value / (duration / stepTime)));

    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  return <>{count}</>;
};

const UserDashboard = () => {
  const [allQueues, setAllQueues] = useState([]);
  const [joinedData, setJoinedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // 🔥 FETCH QUEUES
  const fetchQueues = async (showError = false) => {
    try {
      const { data } = await API.get("/queues");
      setAllQueues(Array.isArray(data) ? data : []);

      const validResponses = await Promise.allSettled(
        (Array.isArray(data) ? data : []).map((queue) =>
          API.get(`/queues/${queue._id}`),
        ),
      );

      const result = [];

      validResponses.forEach((response) => {
        if (response.status === "fulfilled") {
          const payload = response.value.data;
          const queue = payload?.queue;
          const tokens = Array.isArray(payload?.tokens) ? payload.tokens : [];

          if (!queue) return;

          const myToken = tokens.find(
            (item) => item.user?._id === userInfo?._id,
          );

          if (myToken) {
            result.push({ queue, myToken });
          }
        }
      });

      setJoinedData(result);
    } catch (error) {
      if (showError) {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchQueues(true);
  }, []);

  // 🔥 SOCKET REALTIME
  useEffect(() => {
    const joinedQueueIds = joinedData.map((item) => item.queue._id);

    joinedQueueIds.forEach((queueId) => {
      socket.emit("joinQueueRoom", queueId);
    });

    const handler = () => {
      fetchQueues(false);
    };

    socket.on("queueUpdated", handler);

    return () => {
      socket.off("queueUpdated", handler);
    };
  }, [joinedData]);

  // 🔥 OPTIONAL DEBOUNCE REFRESH (UX SMOOTH)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchQueues(false);
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  if (loading) return <Loader />;

  const totalETA = joinedData.reduce(
    (sum, item) => sum + Number(item.myToken?.estimatedWaitTime || 0),
    0,
  );

  return (
    <DashboardLayout>
      <div className="dashboard-top">
        <div>
          <h2 className="heading">My Queue Dashboard</h2>
          <p className="subtext">Welcome back, {userInfo?.name}</p>
        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="stats-grid">
        <StatCard
          label="Joined Queues"
          value={<AnimatedCounter value={joinedData.length} />}
        />
        <StatCard label="Total ETA" value={formatEta(totalETA)} />
        <StatCard
          label="Available Queues"
          value={<AnimatedCounter value={allQueues.length} />}
        />
        <StatCard label="Live Tracking" value="Enabled" />
      </div>

      {/* 🔥 QUEUE LIST */}
      {joinedData.length === 0 ? (
        <div className="glass empty-box">You haven’t joined any queue yet.</div>
      ) : (
        <div className="grid grid-2">
          {joinedData.map(({ queue, myToken }) => {
            const progress = calculateProgress(
              myToken.tokenNumber,
              queue.currentServingToken || 0,
            );

            return (
              <div key={queue._id} className="gradient-card">
                <div className="gradient-card-inner">
                  <div className="row-between">
                    <div>
                      <h3 className="queue-title">{queue.title}</h3>
                      <p className="queue-meta">
                        {queue.location} • {queue.category}
                      </p>
                    </div>

                    <span
                      className={`status-pill ${
                        queue.isOpen ? "status-open" : "status-closed"
                      }`}
                    >
                      {queue.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  {/* INFO */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 16,
                    }}
                  >
                    <span className="info-chip">
                      My Token: #{myToken.tokenNumber}
                    </span>
                    <span className="info-chip">Status: {myToken.status}</span>
                    <span className="info-chip">
                      Now Serving: #{queue.currentServingToken || 0}
                    </span>
                    <span className="info-chip">
                      ETA: {formatEta(myToken.estimatedWaitTime || 0)}
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <ProgressBar value={progress} label="Queue Progress" />

                  {/* TEXT */}
                  <div style={{ marginTop: 16 }}>
                    <p className="subtext">
                      Your estimated wait time is{" "}
                      <strong>
                        {formatEta(myToken.estimatedWaitTime || 0)}
                      </strong>
                    </p>
                  </div>

                  {/* ❌ CANCEL BUTTON */}
                  <div style={{ marginTop: 16 }}>
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        try {
                          await deleteToken(myToken._id);
                          toast.success("Queue cancelled");
                          fetchQueues(true);
                        } catch {
                          toast.error("Cancel failed");
                        }
                      }}
                    >
                      Cancel Queue
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
