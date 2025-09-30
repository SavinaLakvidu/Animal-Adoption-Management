import React from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import RescuedPet from "../pages/RescuedPet";
import PetListing from "../pages/Admin/PetListing";
import EditProduct from "../pages/Admin";
import UpdateProduct from "../pages/UpdateProduct";
import Donations from "../pages/Donations"
import Volunteers from "../pages/Volunteers"

function AdminDashboard() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link to="/admin/rescued-pet">
          <button className={location.pathname === "/admin/rescued-pet" ? styles.active : ""}>
            Rescued Pets
          </button>
        </Link>
        <Link to="/admin/pet-profiles">
          <button className={location.pathname === "/admin/pet-profiles" ? styles.active : ""}>
            Pet Profiles
          </button>
        </Link>
        <Link to="/admin/edit-product">
          <button className={location.pathname === "/admin/edit-product" ? styles.active : ""}>
            Add New Products
          </button>
        </Link>
        <Link to="/admin/donations">
          <button className={location.pathname === "/admin/donations" ? styles.active : ""}>
            Donations
          </button>
        </Link>
        <Link to="/admin/volunteers">
          <button className={location.pathname === "/admin/volunteers" ? styles.active : ""}>
            Volunteers
          </button>
        </Link>
      </aside>

      <main className={styles.content}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/rescued-pet" replace />} />
          <Route path="rescued-pet" element={<RescuedPet />} />
          <Route path="pet-profiles" element={<PetListing />} />
          <Route path="edit-product" element={<EditProduct />} />
          <Route path="update-product/:id" element={<UpdateProduct />} />
          <Route path="donations" element={<Donations />} />
          <Route path="volunteers" element={<Volunteers />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
