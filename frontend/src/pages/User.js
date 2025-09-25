import React, { useState, useEffect } from "react";
import styles from "./user.module.css";
import { Link } from "react-router-dom";
import API from "../services/api";

function User() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setCart([...cart, product]);
      alert(`${product.name} added to cart! (${cart.length + 1} items)`);
    }
  };

  const showCheckout = () => {
    setShowCheckoutForm(true);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Cart Total: $${total.toFixed(2)}\nProceed to checkout with the form.`);
  };

  const hideCheckout = () => setShowCheckoutForm(false);

  const completePurchase = () => {
    alert("Purchase completed! Thank you for shopping at Pawfect Home.");
    setCart([]);
    hideCheckout();
  };

  return (
    <div>
      <div className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Pawfect Home</div>

        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarSectionTitle}>Products</h3>
        </div>

        <ul className={styles.sidebarMenu}>
          <li className={styles.sidebarMenuItem}>
            <Link to="/">
              <i className="material-icons">home</i>
              <span>Home</span>
            </Link>
          </li>
          <li className={`${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}`}>
            <Link to="/user">
              <i className="material-icons">pets</i>
              <span>Pet Shop</span>
            </Link>
          </li>
          <li className={styles.sidebarMenuItem}>
            <Link to="/medical-records">
              <i className="material-icons">article</i>
              <span>Medical Records</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.heading}>Pet Shop</h2>
          <div className={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className={styles.productCard}>
                  <img
                    src={product.image || "https://placehold.co/150x150"}
                    alt={product.name}
                    onError={(e) => (e.target.src = "https://placehold.co/150x150")}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description || "No description available"}</p>
                  <p>
                    <strong>${product.price ? product.price.toFixed(2) : "N/A"}</strong>
                  </p>
                  <button className={styles.addToCart} onClick={() => addToCart(product._id)}>
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>Loading products or no products available...</p>
            )}
          </div>

          <button className={styles.cartBtn} onClick={showCheckout}>
            View Cart & Checkout
          </button>

          {showCheckoutForm && (
            <div className={styles.checkoutForm}>
              <h3>Checkout</h3>
              <label htmlFor="name">Full Name:</label>
              <input type="text" id="name" required />
              <label htmlFor="address">Shipping Address:</label>
              <input type="text" id="address" required />
              <label htmlFor="payment">Payment Method:</label>
              <select id="payment" required>
                <option value="">Select</option>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
              <button onClick={completePurchase}>Complete Purchase</button>
              <button onClick={hideCheckout}>Cancel</button>
            </div>
          )}

          <div className={styles.recommendations}>
            <h3>Recommended Products</h3>
            <p>Based on popularity: Flea Treatment Spray ($15.99)</p>
            <p>Recently added: Pet Vitamin Supplement ($10.99)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
