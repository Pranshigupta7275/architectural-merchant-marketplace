import  { useState } from 'react';
import { 
  useCreateProductMutation, 
  useUploadProductImageMutation 
} from '../services/productsApiSlice';

const AddProductScreen = () => {
  // --- Form State ---
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // This will store the URL from the backend

  // --- UI Feedback State ---
  const [message, setMessage] = useState('');

  // --- RTK Query Hooks ---
  const [createProduct, { isLoading: isCreating, error: createError }] = useCreateProductMutation();
  const [uploadImage, { isLoading: isUploading, error: uploadError }] = useUploadProductImageMutation();

  // ==========================================
  // HANDLER: Image Upload (Step 1)
  // ==========================================
  const uploadFileHandler = async (e) => {
    // 1. Grab the file the user just selected
    const file = e.target.files[0];
    
    // 2. We MUST use FormData when sending physical files
    const formData = new FormData();
    formData.append('image', file); // 'image' matches upload.single('image') on the backend

    try {
      setMessage('');
      // 3. Fire the mutation to the backend
      const res = await uploadImage(formData).unwrap();
      
      // 4. Save the returned URL to our React state so we can preview it and submit it later
      setImage(res.data.url);
      setMessage('Image uploaded successfully! Ready to submit.');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  // ==========================================
  // HANDLER: Form Submission (Step 2)
  // ==========================================
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic validation
    if (!image) {
      alert('Please upload an image first!');
      return;
    }

    try {
      // Send the complete product payload to MongoDB
      const res = await createProduct({
        name,
        price: Number(price),
        brand,
        category,
        countInStock: Number(countInStock),
        description,
        image, // The URL we got from Step 1
      }).unwrap();

      setMessage('Product created successfully!');
      console.log('Created Product:', res);

      // Clear the form after success
      setName('');
      setPrice('');
      setBrand('');
      setCategory('');
      setCountInStock('');
      setDescription('');
      setImage('');
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Add New Architectural Product</h2>
      
      {/* UI Notifications */}
      {message && <div style={{ color: 'green', padding: '10px', backgroundColor: '#e6ffe6', marginBottom: '15px' }}>{message}</div>}
      {uploadError && <div style={{ color: 'red', marginBottom: '15px' }}>{uploadError?.data?.message || 'Image upload failed'}</div>}
      {createError && <div style={{ color: 'red', marginBottom: '15px' }}>{createError?.data?.message || 'Failed to create product'}</div>}

      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Name */}
        <div>
          <label>Product Name</label><br/>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Price & Stock (Side by side) */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Price ($)</label><br/>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Count In Stock</label><br/>
            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>

        {/* Brand & Category */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Brand / Manufacturer</label><br/>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Category</label><br/>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div style={{ border: '1px dashed #ccc', padding: '15px', backgroundColor: '#f9f9f9' }}>
          <label>Product Image</label><br/>
          {/* Read-only input showing the path if successful */}
          <input type="text" value={image} placeholder="Image URL will appear here" readOnly style={{ width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: '#eee' }} />
          
          {/* The actual file input */}
          <input type="file" onChange={uploadFileHandler} accept="image/jpeg, image/png, image/webp" />
          {isUploading && <span style={{ marginLeft: '10px', color: 'blue' }}>Uploading image...</span>}

          {/* Image Preview Window */}
          {image && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: 'gray' }}>Preview:</p>
              {/* Remember: image contains "/uploads/filename.jpg". We prepend the backend URL to view it */}
              <img src={`http://localhost:5000${image}`} alt="Product Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label>Description</label><br/>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" style={{ width: '100%', padding: '8px' }}></textarea>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isCreating || isUploading}
          style={{ 
            padding: '12px', 
            backgroundColor: (isCreating || isUploading) ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            cursor: (isCreating || isUploading) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isCreating ? 'Saving Product...' : 'Create Product'}
        </button>

      </form>
    </div>
  );
};

export default AddProductScreen;