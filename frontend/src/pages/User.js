import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './user.module.css'; // CSS Module import

function User() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item._id === product._id);
    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [
        ...cart,
        {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className={styles.userContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <h2 className={styles.heading}>Pet Shop</h2>

        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map((p) => (
              <div key={p._id} className={styles.productCard}>
                <img
                  src={p.image || 'https://placehold.co/150x150'}
                  alt={p.name}
                  onError={(e) => { e.target.src = 'https://placehold.co/150x150'; }}
                />
                <h3>{p.name}</h3>
                <p>{p.description || 'No description available'}</p>
                <p><strong>${p.price ? p.price.toFixed(2) : 'N/A'}</strong></p>
                <button onClick={() => addToCart(p._id)} className={styles.addBtn}>
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>Loading products…</p>
          )}
        </div>

        {/* Centered View Cart & Checkout Button */}
        <div className={styles.cartActions}>
          <button className={styles.cartBtn} onClick={() => navigate('/Viewcart')}>
            View Cart & Checkout
          </button>
        </div>
      </main>
    </div>
  );
}

export default User;
