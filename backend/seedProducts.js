const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
    {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and long battery life.',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    },
    {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking and notifications.',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
    },
    {
        name: 'Laptop Backpack',
        description: 'Durable and stylish backpack with a padded laptop compartment.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'
    },
    {
        name: 'Mechanical Keyboard',
        description: 'Tactile mechanical keyboard for the ultimate typing experience.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800'
    },
    {
        name: 'Gaming Mouse',
        description: 'Precision gaming mouse with customizable RGB lighting.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with deep bass and waterproof design.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing products to avoid duplicates if needed, 
        // but here we will just add new ones if count is low, 
        // or simply add these on top to ensure we satisfy "at least 6".
        // For simplicity, let's delete all and re-seed to ensure clean state.
        await Product.deleteMany({});
        console.log('Deleted existing products');

        await Product.insertMany(products);
        console.log('✅ Added 6 new products');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
