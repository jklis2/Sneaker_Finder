import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Product {
  name: string;
  price: number;
  brand: string;
  color: string;
  imageUrl: string;
  availableSizes: string[];
}

export default function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    brand: '',
    color: '',
    imageUrl: '',
    availableSizes: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with ID: ${id}`);
        console.log(`API URL: ${import.meta.env.VITE_API_URL}`);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        console.log(`Product data: ${JSON.stringify(data)}`);
        setFormData(data);
      } catch (error: unknown) {
        console.error(`Error fetching product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'availableSizes') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(size => size.trim()),
      }));
    } else if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log(`Token: ${token}`);
      console.log(`API URL: ${import.meta.env.VITE_API_URL}`);
      console.log(`Sending data: ${JSON.stringify(formData)}`);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log(`Response status: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response text: ${responseText}`);

      if (!response.ok) {
        throw new Error(responseText || 'Failed to update product');
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error: unknown) {
      console.error(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {t('editProduct.title', 'Edit Product')}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-md mb-4">
            {t('editProduct.success', 'Product updated successfully')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('editProduct.name', 'Name')}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              {t('editProduct.price', 'Price')}
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              {t('editProduct.brand', 'Brand')}
            </label>
            <input
              id="brand"
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              {t('editProduct.color', 'Color')}
            </label>
            <input
              id="color"
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              {t('editProduct.imageUrl', 'Image URL')}
            </label>
            <input
              id="imageUrl"
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="availableSizes" className="block text-sm font-medium text-gray-700 mb-1">
              {t('editProduct.availableSizes', 'Available Sizes')}
            </label>
            <input
              id="availableSizes"
              type="text"
              name="availableSizes"
              value={formData.availableSizes.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              {t('editProduct.sizesHelperText', 'Enter sizes separated by commas (e.g., 38, 39, 40)')}
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                t('editProduct.save', 'Save Changes')
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 border border-black text-black py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}