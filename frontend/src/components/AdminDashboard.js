import React from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import RescuedPet from "../pages/RescuedPet";
import PetListing from "../pages/Admin/PetListing";
import EditProduct from "../pages/Admin";
import UpdateProduct from "../pages/UpdateProduct";

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
      </aside>

      <main className={styles.content}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/rescued-pet" replace />} />
          <Route path="rescued-pet" element={<RescuedPet />} />
          <Route path="pet-profiles" element={<PetListing />} />
          <Route path="edit-product" element={<EditProduct />} />
          <Route path="update-product/:id" element={<UpdateProduct />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
