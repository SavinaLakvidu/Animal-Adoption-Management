// src/pages/Home.js
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import styles from "./Home.module.css"; // CSS Module import

function Home() {
  return (
    <div className={styles.homeContainer}>
      <Carousel fade interval={4000}>
        {/* Slide 1 - Welcome */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/1000/400?id=10"
            alt="Welcome slide"
          />
          <Carousel.Caption>
            <h1>Welcome to Pawfect Home</h1>
            <p>Find your perfect furry friend today!</p>
            <Link to="/pet-adoption">
              <Button variant="danger" size="lg">Adopt Now</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 - Why Adopt */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/1000/401"
            alt="Why Adopt"
          />
          <Carousel.Caption>
            <h1>Why Adopt?</h1>
            <p>Give a loving pet a forever home and experience unconditional love.</p>
            <Link to="/pet-adoption">
              <Button variant="danger" size="lg">See Pets</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 - Support Us */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/1000/402"
            alt="Support Us"
          />
          <Carousel.Caption>
            <h1>Support Us</h1>
            <p>Donate or volunteer to help rescued pets in need.</p>
            <Link to="/donations">
              <Button variant="danger" size="lg">Donate Now</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 4 - Our Pets */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/1000/403"
            alt="Our Pets"
          />
          <Carousel.Caption>
            <h1>Our Pets</h1>
            <p>Dogs and Cats ready for adoption, all healthy and vaccinated.</p>
            <Link to="/pet-adoption">
              <Button variant="danger" size="lg">Adopt Now</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 5 - Pet Shop */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/1000/404"
            alt="Pet Shop"
          />
          <Carousel.Caption>
            <h1>Pet Shop</h1>
            <p>Find quality food, toys, and accessories for your pets.</p>
            <Link to="/petshop">
              <Button variant="danger" size="lg">Shop Now</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 6 - Rescued Pets */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/1000/405"
            alt="Rescued Pets"
          />
          <Carousel.Caption>
            <h1>Rescued Pets</h1>
            <p>Meet our rescued pets and give them a loving home.</p>
            <Link to="/rescued-pets">
              <Button variant="danger" size="lg">View Rescued Pets</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Info Section */}
      <div className={styles.homeInfo}>
        <div className={styles.infoBox}>
          <h3>Adopt a Pet</h3>
          <p>Give a loving home to pets who need you the most.</p>
        </div>
        <div className={styles.infoBox}>
          <h3>Pet Shop</h3>
          <p>Shop the best food, toys, and accessories for your pets.</p>
        </div>
        <div className={styles.infoBox}>
          <h3>Support Us</h3>
          <p>Help rescued animals through volunteering and donations.</p>
        </div>
        <div className={styles.infoBox}>
          <h3>Rescued Pets</h3>
          <p>Explore our rescued pets waiting for adoption and give them a loving home.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
