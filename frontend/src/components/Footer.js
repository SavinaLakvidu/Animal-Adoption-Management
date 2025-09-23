// src/components/Footer.js
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo & About */}
        <div className="footer-section">
          <h2 className="footer-logo">Pawfect Home</h2>
          <p className="footer-text">
            Helping pets find loving homes. Adopt, don’t shop! 🐾
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pet-adoption">All Pets</Link></li>
            <li><Link to="/petshop">Pet Shop</Link></li>
            <li><Link to="/medical-records">Medical Records</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@pawfecthome.com</p>
          <p>Phone: +94 77 123 4567</p>
          <p>Address: Colombo, Sri Lanka</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">🐶</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">🐱</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐾</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Pawfect Home. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
