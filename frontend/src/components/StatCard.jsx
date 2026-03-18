import { motion } from "framer-motion";

const StatCard = ({ label, value }) => {
  return (
    <motion.div
      className="glass stat-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </motion.div>
  );
};

export default StatCard;
