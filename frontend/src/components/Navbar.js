import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">Pawfect Home</Link>
        </div>
        <nav className="nav-menu">
          <Link className="nav-btn" to="/">Home</Link>
          <Link className="nav-btn" to="/petshop">Pet Shop</Link>
          <Link className="nav-btn" to="/pet-adoption">All Pets</Link>
          <Link className="nav-btn" to="/pet-adoption?filter=Dog">Dogs</Link>
          <Link className="nav-btn" to="/pet-adoption?filter=Cat">Cats</Link>
          <Link className="nav-btn" to="/medical-records">Medical Records</Link>
          <Link className="nav-btn" to="/login">Login</Link>
          <Link className="nav-btn" to="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
