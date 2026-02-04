import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                />
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">Rs.{product.price.toFixed(2)}</span>
                    {/* <button className="add-to-cart-btn" aria-label={`Add ${product.name} to cart`}>
                        Add to Cart
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
