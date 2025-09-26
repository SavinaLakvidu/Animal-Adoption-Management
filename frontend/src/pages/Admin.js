import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js'; // updated import for centralized API
import styles from './admin.module.css';
import { createClient } from "@supabase/supabase-js";
import { Toast, ToastContainer } from 'react-bootstrap';

const url = "https://bhkdfzybeyvkbbykvkcr.supabase.co";
const key = "YOUR_SUPABASE_KEY";

const supabase = createClient(url, key);

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [file, setFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data);
      } catch (error) {
        setToastMessage('Failed to fetch products.');
        setToastVariant('danger');
        setShowToast(true);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewProduct(prev => ({ ...prev, [id]: value }));
  };

  const handleSupabaseUpload = async () => {
    if (!file) {
      setToastMessage("Please select a file to upload.");
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setToastMessage("Only JPEG or PNG images are allowed.");
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }

    const fileName = `${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage
        .from("image")
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: urlData, error: urlError } = supabase.storage
        .from("image")
        .getPublicUrl(fileName);

      if (urlError || !urlData.publicUrl) throw urlError || new Error('No public URL');

      const publicUrl = urlData.publicUrl;
      setNewProduct(prev => ({ ...prev, image: publicUrl }));
      setFile(null);
      setToastMessage("Image uploaded successfully!");
      setToastVariant("success");
      setShowToast(true);
      return publicUrl;
    } catch (err) {
      setToastMessage(`Upload failed: ${err.message}`);
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      setToastMessage('Please fill in all required fields.');
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    let imageUrl = newProduct.image;
    if (file) {
      const uploadedUrl = await handleSupabaseUpload();
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    try {
      const productToAdd = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image: imageUrl,
      };
      const response = await API.post('/products', productToAdd);
      setProducts(prev => [...prev, response.data]);
      setNewProduct({ name: '', description: '', price: '', image: '' });
      setFile(null);
      setToastMessage('Product added successfully!');
      setToastVariant("success");
      setShowToast(true);
    } catch (err) {
      setToastMessage(`Failed to add product: ${err.message}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(product => product._id !== id));
      setToastMessage('Product deleted successfully!');
      setToastVariant("success");
      setShowToast(true);
    } catch (err) {
      setToastMessage('Failed to delete product.');
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleEditProduct = (id) => {
    if (!id) return;
    navigate(`/admin/update-product/${id}`);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.mainContent}>
        <div className={styles.pageContent}>
          <div className={styles.container}>
            <h2 className={styles.heading}>Medical Shop Management</h2>

            <div className={styles.formSection}>
              <h3>Add New Product</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Product Name:</label>
                  <input id="name" type="text" value={newProduct.name} onChange={handleInputChange} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="price">Price:</label>
                  <input id="price" type="number" value={newProduct.price} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={newProduct.description} onChange={handleInputChange}></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Upload Image:</label>
                <input type="file" accept="image/jpeg, image/png" onChange={e => setFile(e.target.files[0])} />
                <button className={styles.uploadBtn} onClick={handleSupabaseUpload}>Upload</button>
                {newProduct.image && <p className={styles.imagePreview}>Image uploaded: <a href={newProduct.image} target="_blank" rel="noopener noreferrer">View Image</a></p>}
              </div>

              <button className={styles.addProductBtn} onClick={handleAddProduct}>Add Product</button>
            </div>

            <div className={styles.searchSection}>
              <input type="text" placeholder="Search by Product ID or Name" onKeyUp={() => {}} />
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Image URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${product.price}</td>
                      <td>{product.image ? <a href={product.image} target="_blank" rel="noopener noreferrer">{product.image.substring(0, 30)}...</a> : 'No image'}</td>
                      <td>
                        <button className={styles.editBtn} onClick={() => handleEditProduct(product._id)}>Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

export default Admin;
