import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserPlus, FaDonate, FaHandsHelping, FaPaw, FaUserCircle } from "react-icons/fa";
import styles from "./Navbar.module.css";
import { useAuth } from "../context/AuthContext";

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const role = (user?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";

  return (
    <Navbar expand="lg" variant="dark" className={`${styles.customNavbar} py-3`} sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className={`d-flex align-items-center me-5 ${styles.brand}`}>
          <FaHome className="me-2" />
          <span className={styles.brandText}>Pawfect Home</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`ms-auto align-items-center ${styles.navContainer}`}>
            <Nav.Link as={Link} to="/products" className={`mx-3 ${styles.navItem}`}>Pet Shop</Nav.Link>
            <Nav.Link as={Link} to="/rescued-pet" className={`mx-3 d-flex align-items-center ${styles.navItem}`}>
              <FaPaw className="me-1" /> Rescued Pets
            </Nav.Link>
            <Nav.Link as={Link} to="/pet-profiles" className={`mx-3 d-flex align-items-center ${styles.navItem}`}>
              <FaPaw className="me-1" /> All Pets
            </Nav.Link>

            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className={`mx-3 ${styles.navItem}`}>Dashboard</Nav.Link>
            )}

            <Nav.Link as={Link} to="/donations" className={`mx-3 d-flex align-items-center ${styles.navItem}`}>
              <FaDonate className="me-1" /> Donate
            </Nav.Link>
            <Nav.Link as={Link} to="/volunteering" className={`mx-3 d-flex align-items-center ${styles.navItem}`}>
              <FaHandsHelping className="me-1" /> Volunteer
            </Nav.Link>

            {!isLoggedIn && !isRegisterPage && (
              <Nav.Link as={Link} to="/register" className={`mx-3 d-flex align-items-center ${styles.navItem}`}>
                <FaUserPlus className="me-1" /> Register
              </Nav.Link>
            )}

            {!isLoggedIn && !isLoginPage && (
              <Nav.Link as={Link} to="/login" className={`mx-3 ${styles.navItem}`}>Login</Nav.Link>
            )}

            {isLoggedIn && (
              <Nav.Link onClick={handleLogout} className={`d-flex align-items-center mx-3 ${styles.navItem}`} style={{ cursor: "pointer" }}>
                <FaUserCircle className="me-1" /> Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
