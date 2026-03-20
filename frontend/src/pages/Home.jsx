// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div>
//       <section className="hero">
//         <div className="container hero-wrap">
//           <div className="hero-left">
//             <div className="hero-badges" style={{ marginBottom: "18px" }}>
//               <span className="badge">Smart Queueing</span>
//               <span className="badge">Live ETA</span>
//               <span className="badge">Hackathon Ready</span>
//             </div>

//             <h1>
//               Skip the line.
//               <br />
//               Track your turn.
//               <br />
//               Save your time.
//             </h1>

//             <p>
//               QueueLess AI is a smart virtual queue management platform for
//               hospitals, banks, colleges, salons, and public offices. Join
//               remotely, view wait progress live, and arrive exactly when your
//               turn is near.
//             </p>

//             <div className="action-row" style={{ marginTop: "22px" }}>
//               <Link to="/queues" className="btn btn-primary">
//                 Explore Queues
//               </Link>
//               <Link to="/admin" className="btn btn-secondary">
//                 Admin Dashboard
//               </Link>
//             </div>
//           </div>

//           <div className="hero-visual">
//             <div className="gradient-card">
//               <div className="gradient-card-inner">
//                 <div className="stats-grid" style={{ marginBottom: 0 }}>
//                   <div className="glass stat-card">
//                     <p className="stat-label">Queues Active</p>
//                     <h3 className="stat-value">24+</h3>
//                   </div>

//                   <div className="glass stat-card">
//                     <p className="stat-label">Average Time Saved</p>
//                     <h3 className="stat-value">43 Min</h3>
//                   </div>

//                   <div className="glass stat-card">
//                     <p className="stat-label">Live Status Updates</p>
//                     <h3 className="stat-value">Realtime</h3>
//                   </div>

//                   <div className="glass stat-card">
//                     <p className="stat-label">Industries Supported</p>
//                     <h3 className="stat-value">5+</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

//-----------------------------------------------------------------
import { Link } from "react-router-dom";

const Home = () => {
  // ✅ Get user info
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div>
      <section className="hero">
        <div className="container hero-wrap">
          <div className="hero-left">
            <div className="hero-badges" style={{ marginBottom: "18px" }}>
              <span className="badge">Smart Queueing</span>
              <span className="badge">Live ETA</span>
              <span className="badge">Hackathon Ready</span>
            </div>

            <h1>
              Skip the line.
              <br />
              Track your turn.
              <br />
              Save your time.
            </h1>

            <p>
              QueueLess AI is a smart virtual queue management platform for
              hospitals, banks, colleges, salons, and public offices. Join
              remotely, view wait progress live, and arrive exactly when your
              turn is near.
            </p>

            <div className="action-row" style={{ marginTop: "22px" }}>
              <Link to="/queues" className="btn btn-primary">
                Explore Queues
              </Link>

              {/* ✅ ADMIN ONLY BUTTON */}
              {userInfo && userInfo.role === "admin" && (
                <Link to="/admin" className="btn btn-secondary">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <div className="gradient-card">
              <div className="gradient-card-inner">
                <div className="stats-grid" style={{ marginBottom: 0 }}>
                  <div className="glass stat-card">
                    <p className="stat-label">Queues Active</p>
                    <h3 className="stat-value">24+</h3>
                  </div>

                  <div className="glass stat-card">
                    <p className="stat-label">Average Time Saved</p>
                    <h3 className="stat-value">43 Min</h3>
                  </div>

                  <div className="glass stat-card">
                    <p className="stat-label">Live Status Updates</p>
                    <h3 className="stat-value">Realtime</h3>
                  </div>

                  <div className="glass stat-card">
                    <p className="stat-label">Industries Supported</p>
                    <h3 className="stat-value">5+</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
