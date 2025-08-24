# Crafshi Backend API

Complete backend API for Crafshi - Premium Handicraft Ecommerce Website

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role management
- **Product Management** - CRUD operations with advanced filtering
- **Shopping Cart** - Add, update, remove items with stock validation
- **Order Management** - Complete order lifecycle with payment integration
- **User Profiles** - Profile management with wishlist functionality
- **Image Upload** - Cloudinary integration for product images
- **Search & Filtering** - Advanced product search and category filtering
- **Reviews & Ratings** - Product review system with rating calculations
- **Security** - Rate limiting, CORS, helmet, input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

## 🛠️ Installation & Setup

### 1. Clone and Setup Backend

```bash
# Navigate to your project folder
cd your-project-folder

# Create backend directory (if not exists)
mkdir backend
cd backend

# Copy all backend files here
# (Copy all the files from the backend folder)

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configurations
nano .env
```

**Required Environment Variables:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/crafshi

# JWT Secret (Generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary (Sign up at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Payment Gateway (Razorpay - Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Database Setup

```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Seed the database with sample data
npm run seed
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 🔧 Frontend Integration

### Update Frontend API Configuration

Create or update `src/config/api.js` in your frontend:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  profile: `${API_BASE_URL}/auth/me`,
  
  // Product endpoints
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/categories`,
  
  // Cart endpoints
  cart: `${API_BASE_URL}/cart`,
  
  // Order endpoints
  orders: `${API_BASE_URL}/orders`,
  
  // User endpoints
  users: `${API_BASE_URL}/users`,
};

// API helper function
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('crafshi_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};
```

### Update Frontend Context Files

**Update `src/context/AuthContext.tsx`:**

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall, api } from '../config/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await apiCall(api.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('crafshi_token', response.token);
    setUser(response.user);
  };

  const register = async (userData: any) => {
    const response = await apiCall(api.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    localStorage.setItem('crafshi_token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('crafshi_token');
    setUser(null);
  };

  // Check for existing token on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('crafshi_token');
      if (token) {
        try {
          const response = await apiCall(api.profile);
          setUser(response.user);
        } catch (error) {
          localStorage.removeItem('crafshi_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Product Endpoints

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products/:id/review` - Add product review (Protected)
- `GET /api/products/featured/list` - Get featured products

### Cart Endpoints

- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `PUT /api/cart/update` - Update cart item (Protected)
- `DELETE /api/cart/remove/:productId` - Remove from cart (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Order Endpoints

- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Category Endpoints

- `GET /api/categories` - Get all categories with counts
- `GET /api/categories/:category/featured` - Get featured products by category
- `GET /api/categories/stats` - Get category statistics

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Cross-origin request security
- **Input Validation** - express-validator for request validation
- **Helmet** - Security headers
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "crafshi-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🧪 Testing

```bash
# Test API endpoints
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@crafshi.com","password":"customer123"}'
```

## 📝 Default Login Credentials

After running `npm run seed`:

- **Admin**: admin@crafshi.com / admin123
- **Customer**: customer@crafshi.com / customer123

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Make sure MongoDB is running
   sudo systemctl start mongod
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   sudo lsof -t -i tcp:5000 | xargs kill -9
   ```

3. **JWT Secret Error**
   ```bash
   # Generate a strong JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Cloudinary Upload Issues**
   - Verify Cloudinary credentials in .env
   - Check file size limits (5MB max)
   - Ensure proper image formats (jpg, png, webp)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify environment variables
3. Check MongoDB connection
4. Review API documentation

## 🔄 Updates

To update the backend:
1. Pull latest changes
2. Run `npm install` for new dependencies
3. Update environment variables if needed
4. Restart the server

---

**🎉 Your Crafshi backend is now ready! The API server will run on http://localhost:5000**