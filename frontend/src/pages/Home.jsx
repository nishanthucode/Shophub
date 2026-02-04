import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Shophub</h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800"
            alt="Shopping"
          />
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="products-section">
        <h2>Popular Products</h2>

        {loading && <p className="loading">Loading products...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && products.length === 0 && (
          <p className="no-products">No products available yet. Check back soon!</p>
        )}

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
