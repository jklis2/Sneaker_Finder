import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";
import Pagination from "../components/Pagination";
import SearchProduct from "../components/SearchProduct";

interface BrandProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  brand: string;
}

export default function Brand() {
  const { brandName } = useParams();
  const [products, setProducts] = useState<BrandProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 20;

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/product`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const formattedBrandName = brandName
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        const brandProducts = data.filter(
          (product: BrandProduct) => product.brand === formattedBrandName
        );
        setProducts(brandProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandProducts();
    setCurrentPage(1); // Reset page when brand changes
  }, [brandName]);

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const searchLower = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const formattedBrandName = brandName
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{formattedBrandName}</h1>
        <div className="mb-8">
          <SearchProduct onSearch={handleSearch} />
        </div>
        {currentProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {searchTerm ? "No products found matching your search" : "No products found for this brand"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                size="normal"
              />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
