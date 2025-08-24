const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

// Sample products data
const sampleProducts = [
  {
    name: "Banarasi Silk Saree",
    description: "Exquisite handwoven Banarasi silk saree with intricate gold zari work",
    price: 15000,
    category: "textiles",
    images: [{ url: "https://images.pexels.com/photos/8832878/pexels-photo-8832878.jpeg", isPrimary: true }],
    seller: { name: "Rajesh Kumar", location: "Varanasi, Uttar Pradesh" },
    specifications: {
      materials: ["Pure Silk", "Gold Zari"],
      dimensions: "6.5 meters",
      weight: "800g",
      technique: "Handloom Weaving",
      origin: "Varanasi",
      yearMade: 2024
    },
    story: "This beautiful Banarasi saree represents centuries of weaving tradition from the holy city of Varanasi.",
    inStock: 5,
    rating: { average: 4.8, count: 12 },
    isFeatured: true,
    tags: ["silk", "banarasi", "wedding", "traditional"]
  },
  {
    name: "Blue Pottery Vase",
    description: "Traditional Jaipur blue pottery vase with floral motifs",
    price: 3500,
    category: "pottery",
    images: [{ url: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg", isPrimary: true }],
    seller: { name: "Meera Sharma", location: "Jaipur, Rajasthan" },
    specifications: {
      materials: ["Clay", "Natural Dyes"],
      dimensions: "12 inches height",
      weight: "1.2kg",
      technique: "Blue Pottery",
      origin: "Jaipur",
      yearMade: 2024
    },
    story: "Blue pottery is a traditional craft of Jaipur, known for its distinctive blue dye and intricate patterns.",
    inStock: 8,
    rating: { average: 4.6, count: 8 },
    isFeatured: true,
    tags: ["pottery", "blue", "jaipur", "decorative"]
  },
  {
    name: "Kundan Meenakari Necklace",
    description: "Royal Kundan necklace with meenakari work and precious stones",
    price: 25000,
    category: "jewelry",
    images: [{ url: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg", isPrimary: true }],
    seller: { name: "Suresh Jewellers", location: "Jaipur, Rajasthan" },
    specifications: {
      materials: ["Gold", "Kundan", "Precious Stones"],
      dimensions: "16 inches",
      weight: "150g",
      technique: "Kundan Setting",
      origin: "Rajasthan",
      yearMade: 2024
    },
    story: "Kundan jewelry represents the pinnacle of Indian jewelry craftsmanship, favored by royalty for centuries.",
    inStock: 3,
    rating: { average: 4.9, count: 15 },
    isFeatured: true,
    tags: ["kundan", "jewelry", "royal", "wedding"]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crafshi');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@crafshi.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
      isVerified: true
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create sample customer
    const customer = new User({
      name: 'John Doe',
      email: 'customer@crafshi.com',
      password: 'customer123',
      phone: '9876543211',
      role: 'customer',
      isVerified: true
    });
    await customer.save();
    console.log('Created sample customer');

    // Create sample products
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    console.log(`Created ${sampleProducts.length} sample products`);

    console.log('✅ Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@crafshi.com / admin123');
    console.log('Customer: customer@crafshi.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();