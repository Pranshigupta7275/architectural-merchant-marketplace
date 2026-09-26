import { useState } from 'react';
import { 
  useCreateProductMutation, 
  useUploadProductImageMutation 
} from '../services/productsApiSlice';
import { Loader2 } from 'lucide-react';

const AddProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  const [createProduct, { isLoading: isCreating, error: createError }] = useCreateProductMutation();
  const [uploadImage, { isLoading: isUploading, error: uploadError }] = useUploadProductImageMutation();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setMessage('');
      const res = await uploadImage(formData).unwrap();
      setImage(res.data.url);
      setMessage('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!image) {
      setMessage('Please upload an image first!');
      return;
    }

    try {
      const res = await createProduct({
        name,
        price: Number(price),
        brand,
        category,
        countInStock: Number(countInStock),
        description,
        image,
      }).unwrap();

      setMessage('Product created successfully!');
      setName('');
      setPrice('');
      setBrand('');
      setCategory('');
      setCountInStock('');
      setDescription('');
      setImage('');
      console.log('Created Product:', res);
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#111827] mb-6">Add New Architectural Product</h2>

      {/* UI Notifications */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}
      {uploadError && (
        <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700 border border-red-200">
          {uploadError?.data?.message || 'Image upload failed'}
        </div>
      )}
      {createError && (
        <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700 border border-red-200">
          {createError?.data?.message || 'Failed to create product'}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
            <input
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand / Manufacturer</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input
            type="file"
            onChange={uploadFileHandler}
            accept="image/jpeg, image/png, image/webp"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#111827] file:text-white hover:file:bg-gray-800"
          />
          {isUploading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading image...
            </div>
          )}
          {image && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <img
                src={`http://localhost:5000${image}`}
                alt="Product Preview"
                className="max-w-full max-h-48 rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating || isUploading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Product...
            </>
          ) : (
            'Create Product'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProductScreen;
