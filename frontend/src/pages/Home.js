// src/pages/Home.js
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-hero">
        <h1>Welcome to Pawfect</h1>
        <p>Find your perfect furry friend today!</p>
        <Link to="/pet-adoption" className="btn-primary">Adopt Now</Link>
      </header>

      <section className="home-info">
        <div className="info-box">
          <h2>Why Adopt?</h2>
          <p>Give a loving pet a forever home and experience unconditional love.</p>
        </div>
        <div className="info-box">
          <h2>Support Us</h2>
          <p>Donate or volunteer to help rescued pets in need.</p>
        </div>
        <div className="info-box">
          <h2>Our Pets</h2>
          <p>Dogs and Cats ready for adoption, all healthy and vaccinated.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
