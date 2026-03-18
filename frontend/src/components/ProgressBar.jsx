const ProgressBar = ({ value = 0, label = "Progress" }) => {
  return (
    <div className="progress-wrap">
      <div className="progress-head">
        <span className="small-text">{label}</span>
        <span className="small-text">{Math.round(value)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
