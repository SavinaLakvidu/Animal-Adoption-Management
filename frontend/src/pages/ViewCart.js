import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './viewcart.module.css';

function ViewCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', payment: '', contact: '' });
  const [formErrors, setFormErrors] = useState({ name: '', address: '', payment: '', contact: '' });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // ✅ FIXED: remove only the clicked item by array index
  const removeFromCart = (indexToRemove) => {
    const newCart = cart.filter((_, i) => i !== indexToRemove);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const showCheckout = () => {
    if (!cart.length) {
      alert('Cart is empty! Add items before checkout.');
      return;
    }
    setShowCheckoutForm(true);
  };

  const hideCheckout = () => {
    setShowCheckoutForm(false);
    setFormData({ name: '', address: '', payment: '', contact: '' });
    setFormErrors({ name: '', address: '', payment: '', contact: '' });
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: '', address: '', payment: '', contact: '' };
    const nameRegex = /^[a-zA-Z\s\u0D80-\u0DFF]+$/;
    const contactRegex = /^(\+?94)?0[0-9]{9}$/;

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
      valid = false;
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
      valid = false;
    } else if (!nameRegex.test(formData.name)) {
      errors.name = 'Name can only contain letters and spaces.';
      valid = false;
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required.';
      valid = false;
    } else if (formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters long.';
      valid = false;
    }

    if (!formData.payment) {
      errors.payment = 'Please select a payment method.';
      valid = false;
    }

    if (!formData.contact) {
      errors.contact = 'Contact number is required.';
      valid = false;
    } else if (!contactRegex.test(formData.contact)) {
      errors.contact = 'Contact must be a valid 10-digit number (e.g., 0771234567 or +94771234567).';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const completePurchase = () => {
    if (!validateForm()) {
      alert('Please fix the errors in the form.');
      return;
    }
    alert('Purchase completed! Thank you for shopping at Pawfect Home.');
    updateCart([]);
    hideCheckout();
    navigate('/');
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.heading}>View Cart</h2>
          {cart.length ? (
            <>
              <div className={styles.productGrid}>
                {cart.map((item, index) => (
                  <div key={index} className={styles.productCard}>
                    <img
                      src={item.image || 'https://placehold.co/150x150'}
                      alt={item.name}
                      className={styles.productCardImg}
                      onError={e => { e.target.src = 'https://placehold.co/150x150'; }}
                    />
                    <h3 className={styles.productCardTitle}>{item.name}</h3>
                    <p className={styles.productCardDescription}>{item.description || 'No description available'}</p>
                    <p>
                      <strong>${item.price?.toFixed(2) || 'N/A'}</strong> x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {/* ✅ Pass the array index to remove only this specific item */}
                    <button
                      className={styles.removeFromCart}
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <p className={styles.totalPrice}>Total: ${total.toFixed(2)}</p>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}

          <button className={styles.cartBtn} onClick={showCheckout}>Proceed to Checkout</button>

          <div className={`${styles.checkoutForm} ${showCheckoutForm ? styles.checkoutFormActive : ''}`}>
            <h3>Checkout</h3>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Full Name:</label>
              <input type="text" id="name" value={formData.name} onChange={handleInputChange} className={styles.formInput} />
              {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.formLabel}>Shipping Address:</label>
              <input type="text" id="address" value={formData.address} onChange={handleInputChange} className={styles.formInput} />
              {formErrors.address && <p className={styles.errorText}>{formErrors.address}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="payment" className={styles.formLabel}>Payment Method:</label>
              <select id="payment" value={formData.payment} onChange={handleInputChange} className={styles.formSelect}>
                <option value="">Select</option>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
              {formErrors.payment && <p className={styles.errorText}>{formErrors.payment}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contact" className={styles.formLabel}>Contact Number:</label>
              <input
                type="tel"
                id="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="e.g., 0771234567 or +94771234567"
                className={styles.formInput}
              />
              {formErrors.contact && <p className={styles.errorText}>{formErrors.contact}</p>}
            </div>

            <button className={styles.checkoutButton} onClick={completePurchase}>Complete Purchase</button>
            <button className={styles.checkoutButton} onClick={hideCheckout}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCart;
