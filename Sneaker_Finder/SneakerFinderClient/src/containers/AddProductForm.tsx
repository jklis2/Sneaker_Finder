import React, { useState } from 'react';
import axios from 'axios';

interface ProductFormData {
  name: string;
  price: number;
  brand: string;
  color: string;
  imageUrl: string;
  availableSizes: string[];
  availability: string;
}

const initialFormData: ProductFormData = {
  name: '',
  price: 0,
  brand: '',
  color: '',
  imageUrl: '',
  availableSizes: [],
  availability: 'available',
};

const AddProductForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [error, setError] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
      setFormData(prevForm => ({
        ...prevForm,
        availableSizes: newSizes
      }));
      
      return newSizes;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/products', formData);
      if (response.status === 201) {
        setFormData(initialFormData);
        setSelectedSizes([]);
        alert('Product added successfully!');
      }
    } catch (err) {
      setError('Error adding product. Please try again.');
      console.error('Error:', err);
    }
  };

  const availableSizeOptions = [
    '36', '36 1/3', '36 2/3',
    '37', '37 1/3', '37 2/3',
    '38', '38 1/3', '38 2/3',
    '39', '39 1/3', '39 2/3',
    '40', '40 1/3', '40 2/3',
    '41', '41 1/3', '41 2/3',
    '42', '42 1/3', '42 2/3',
    '43', '43 1/3', '43 2/3',
    '44', '44 1/3', '44 2/3',
    '45', '45 1/3', '45 2/3',
    '46', '46 1/3', '46 2/3'
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Add New Product</h2>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium mb-1">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium mb-1">
            Availability
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Available Sizes
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {availableSizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors
                  ${selectedSizes.includes(size)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;