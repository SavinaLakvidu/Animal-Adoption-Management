import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import styles from './UpdateProduct.module.css';
import supabase from './supabaseClient'; // use the single client

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product by ID
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setToastMessage('Failed to load product data.');
        setToastVariant('danger');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProduct(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' })); // clear field error
  };

  const handleSupabaseUpload = async () => {
    if (!file) {
      setToastMessage("Please select a file.");
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setToastMessage("Only JPEG or PNG images allowed.");
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }

    const fileName = `${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage.from("image").upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;

      const { data: urlData, error: urlError } = supabase.storage.from("image").getPublicUrl(fileName);
      if (urlError || !urlData.publicUrl) throw new Error("Failed to retrieve public URL.");

      setProduct(prev => ({ ...prev, imageUrl: urlData.publicUrl }));
      setFile(null);
      setToastMessage("Image uploaded successfully!");
      setToastVariant("success");
      setShowToast(true);
      return urlData.publicUrl;
    } catch (err) {
      setToastMessage(`Upload error: ${err.message}`);
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }
  };

  // ✅ Validation
  const validateProduct = () => {
    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required.";
    } else if (product.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters.";
    }

    if (!product.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (product.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!product.price) {
      newErrors.price = "Price is required.";
    } else {
      const priceValue = parseFloat(product.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = "Price must be a valid positive number.";
      }
    }

    if (product.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png)$/i.test(product.imageUrl)) {
      newErrors.imageUrl = "Image must be a valid URL ending with .jpg, .jpeg, or .png";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProduct = async () => {
    if (!validateProduct()) {
      setToastMessage("Please fix validation errors.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    let updatedImageUrl = product.imageUrl;
    if (file) {
      const uploadUrl = await handleSupabaseUpload();
      if (!uploadUrl) return;
      updatedImageUrl = uploadUrl;
    }

    try {
      await axios.put(`http://localhost:3000/products/${id}`, {
        ...product,
        price: parseFloat(product.price),
        imageUrl: updatedImageUrl,
      });
      setToastMessage('Product updated successfully!');
      setToastVariant("success");
      setShowToast(true);
      navigate('/admin');
    } catch (err) {
      console.error('Update error:', err);
      setToastMessage(`Failed to update product: ${err.response?.data?.message || err.message}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.updateProductContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Update Product</h2>

        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name:</label>
              <input
                type="text"
                id="name"
                value={product.name}
                onChange={handleInputChange}
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                value={product.price}
                onChange={handleInputChange}
                className={errors.price ? styles.inputError : ''}
              />
              {errors.price && <p className={styles.errorMessage}>{errors.price}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={product.description}
              onChange={handleInputChange}
              className={errors.description ? styles.inputError : ''}
            ></textarea>
            {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image:</label>
            <div>
              <input type="file" accept="image/jpeg, image/png" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleSupabaseUpload} className={styles.updateProductBtn}>Upload</button>
            </div>
            {product.imageUrl && (
              <p style={{ marginTop: '10px' }}>
                Current Image: <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a>
              </p>
            )}
            {errors.imageUrl && <p className={styles.errorMessage}>{errors.imageUrl}</p>}
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.updateProductBtn} onClick={handleUpdateProduct}>Update Product</button>
            <button className={styles.cancelBtn} onClick={() => navigate('/admin')}>Cancel</button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default UpdateProduct;
