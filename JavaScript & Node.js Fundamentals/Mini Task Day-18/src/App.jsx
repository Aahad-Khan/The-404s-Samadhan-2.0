import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">PROJECT</div>
        <div className="menu">
          <div className="menu-item active">Dashboard</div>
          <div className="menu-item">My Tasks</div>
          <div className="menu-item">Teams</div>
          <div className="menu-item">Settings</div>
        </div>
        <div className="sidebar-footer">Invite your team 🚀</div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="header">
          <h1>Designers</h1>
          <div className="actions">
            <button>+ Add</button>
            <button>⚙️</button>
          </div>
        </div>

        <div className="content-grid">
          {/* Members */}
          <div className="members">
            <h2>Members</h2>

            <div className="member-item">
              <div className="member-info">
                <img src="https://i.pravatar.cc/36?img=1" alt="avatar" />
                <span>Mayank</span>
              </div>
              <div className="member-tasks">322 tasks</div>
            </div>

            <div className="member-item">
              <div className="member-info">
                <img src="https://i.pravatar.cc/36?img=2" alt="avatar" />
                <span>Harsh</span>
              </div>
              <div className="member-tasks">124 tasks</div>
            </div>

            {/* Added Aahad Khan */}
            <div className="member-item">
              <div className="member-info">
                <img src="https://i.pravatar.cc/36?img=3" alt="avatar" />
                <span>Aahad Khan</span>
              </div>
              <div className="member-tasks">210 tasks</div>
            </div>
          </div>

          {/* Profile */}
          <div className="profile">
            <div className="profile-header">
              <img src="https://i.imgflip.com/2/1leu8s.jpgp" alt="profile" />
              <div className="info">
                <h3>The 404s</h3>
                <p>UX Researchers - India</p>
              </div>
            </div>

            <div className="stats">
              <div>
                <h4>729</h4>
                <span>Closed Tasks</span>
              </div>
              <div>
                <h4>13</h4>
                <span>Open Tasks</span>
              </div>
            </div>

            <div className="tasks">
              <h3>Assigned Tasks</h3>
              <div className="task-item">🔹 Search in projects</div>
              <div className="task-item">🔹 Listing on Product Hunt</div>
            </div>

            <div className="activity-log">
              <h3>Last Activity</h3>
              <div className="activity-item">
                <img src="https://picsum.photos/40/40" alt="" />
                <p>Team 404's uploaded 3 files • 2h ago</p>
              </div>
              <div className="activity-item">
                <img src="https://picsum.photos/40/41" alt="" />
                <p>Team 404's listed Product Hunt • 5h ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
