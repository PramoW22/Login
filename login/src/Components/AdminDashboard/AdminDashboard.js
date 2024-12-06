import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-simple">
      <h1>Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Total Users</h2>
          <p>1,250</p>
        </div>
        <div className="stat-card">
          <h2>Active Users</h2>
          <p>845</p>
        </div>
        <div className="stat-card">
          <h2>New Signups</h2>
          <p>230</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Activity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Logged In</td>
              <td>2024-12-04</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Updated Profile</td>
              <td>2024-12-03</td>
            </tr>
            <tr>
              <td>Mike Johnson</td>
              <td>Made a Purchase</td>
              <td>2024-12-02</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional Information Section */}
      <div className="system-overview">
        <h2>System Overview</h2>
        <p>Here you can include charts, graphs, or other visual data representations.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
