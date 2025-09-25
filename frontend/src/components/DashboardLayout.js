// src/components/DashboardLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.dashboardSidebar}>
        <h2 className={styles.sidebarTitle}>Dashboard</h2>
        <nav className={styles.sidebarMenu}>
          <Link to="/dashboard" className={styles.sidebarLink}>Overview</Link>
          <Link to="/dashboard/donations" className={styles.sidebarLink}>Donation History</Link>
          <Link to="/dashboard/pet-listing" className={styles.sidebarLink}>Pet Listing</Link>
          <Link to="/dashboard/medical-records" className={styles.sidebarLink}>Medical Records</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.dashboardContent}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
