import { Clock3, MapPin, Layers3 } from "lucide-react";
import { motion } from "framer-motion";

const QueueCard = ({ queue, onJoin, onServeNext, isAdmin }) => {
  return (
    <motion.div
      className="gradient-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div className="gradient-card-inner">
        <div className="queue-card-top">
          <div>
            <h3 className="queue-title">{queue.title}</h3>
            <p className="queue-meta">
              <MapPin size={15} style={{ marginRight: 6 }} />
              {queue.location}
            </p>
            <p className="queue-meta">
              <Layers3 size={15} style={{ marginRight: 6 }} />
              {queue.category}
            </p>
            <p className="queue-meta">
              <Clock3 size={15} style={{ marginRight: 6 }} />
              Avg service time: {queue.averageServiceTime} min
            </p>
          </div>

          <span
            className={`status-pill ${queue.isOpen ? "status-open" : "status-closed"}`}
          >
            {queue.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}
        >
          <span className="info-chip">
            Current Token: #{queue.currentServingToken || 0}
          </span>
        </div>

        <div className="queue-actions">
          {!isAdmin && queue.isOpen && (
            <button
              className="btn btn-primary"
              onClick={() => onJoin(queue._id)}
            >
              Join Queue
            </button>
          )}

          {isAdmin && (
            <button
              className="btn btn-secondary"
              onClick={() => onServeNext(queue._id)}
            >
              Serve Next
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QueueCard;
