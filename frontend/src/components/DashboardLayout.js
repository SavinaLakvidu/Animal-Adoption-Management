// src/components/DashboardLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="sidebar-link">Overview</Link>
          <Link to="/dashboard/donations" className="sidebar-link">Donation History</Link>
          <Link to="/dashboard/pet-listing" className="sidebar-link">Pet Listing</Link>
          <Link to="/dashboard/medical-records" className="sidebar-link">Medical Records</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
