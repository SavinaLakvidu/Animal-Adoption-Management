import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import './UpdateProduct.module.css';
import { createClient } from "@supabase/supabase-js";

const url = "https://bhkdfzybeyvkbbykvkcr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoa2RmenliZXl2a2JieWt2a2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTI0ODksImV4cCI6MjA3Mzc2ODQ4OX0.A9MHLU-dywbBC-SEqu_nTW5FW0Sc_rodruY5OI7x_Xw";

const supabase = createClient(url, key);

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [file, setFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isLoading, setIsLoading] = useState(true);

  // Validate ID and fetch product data
  useEffect(() => {
    if (!id) {
      setToastMessage('Invalid product ID. Please select a valid product.');
      setToastVariant('danger');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product for update:', error);
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
    setProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
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
      const { error } = await supabase.storage.from("image").upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        setToastMessage(`Failed to upload file: ${error.message}`);
        setToastVariant("danger");
        setShowToast(true);
        return null;
      }

      const { data: urlData, error: urlError } = supabase.storage.from("image").getPublicUrl(fileName);

      if (urlError || !urlData.publicUrl) {
        setToastMessage("Failed to retrieve public URL for the image.");
        setToastVariant("danger");
        setShowToast(true);
        return null;
      }

      const publicUrl = urlData.publicUrl;
      setProduct((prev) => ({ ...prev, imageUrl: publicUrl }));
      setFile(null);
      setToastMessage("Image uploaded successfully!");
      setToastVariant("success");
      setShowToast(true);
      return publicUrl;
    } catch (error) {
      setToastMessage(`Unexpected error: ${error.message}`);
      setToastVariant("danger");
      setShowToast(true);
      return null;
    }
  };

  const handleUpdateProduct = async () => {
    if (!id) {
      setToastMessage('Invalid product ID. Please select a valid product.');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (!product.name || !product.price || !product.description) {
      setToastMessage('Please fill in all required fields.');
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    let updatedImageUrl = product.imageUrl;
    if (file) {
      const uploadUrl = await handleSupabaseUpload();
      if (!uploadUrl) {
        return; // Stop the update if image upload fails
      }
      updatedImageUrl = uploadUrl;
    }

    const productToUpdate = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      imageUrl: updatedImageUrl,
    };

    try {
      await axios.put(`http://localhost:3000/products/${id}`, productToUpdate);
      setToastMessage('Product updated successfully!');
      setToastVariant("success");
      setShowToast(true);
      navigate('/admin'); // Navigate back to the admin page
    } catch (error) {
      console.error('Error updating product:', error);
      setToastMessage(`Failed to update product: ${error.response?.data?.message || error.message}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-product-container">
      <div className="form-container">
        <h2 className="heading">Update Product</h2>

        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name:</label>
              <input
                type="text"
                id="name"
                value={product.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                value={product.price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <div>
              <input
                type="file"
                id="fileInput"
                accept="image/jpeg, image/png"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button onClick={handleSupabaseUpload} style={{ backgroundColor: '#007bff', color: 'white' }}>
                Upload
              </button>
            </div>
            {product.imageUrl && (
              <p style={{ marginTop: '10px' }}>
                Current Image: <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a>
              </p>
            )}
          </div>
          <div className="button-group">
            <button className="update-product-btn" onClick={handleUpdateProduct}>
              Update Product
            </button>
            <button className="cancel-btn" onClick={() => navigate('/admin')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toastVariant}
          delay={3000}
          autohide
        >
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