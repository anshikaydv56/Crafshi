const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  profile: `${API_BASE_URL}/auth/me`,
  updateProfile: `${API_BASE_URL}/auth/profile`,
  
  // Product endpoints
  products: `${API_BASE_URL}/products`,
  productById: (id) => `${API_BASE_URL}/products/${id}`,
  productsByCategory: (category) => `${API_BASE_URL}/products/category/${category}`,
  featuredProducts: `${API_BASE_URL}/products/featured/list`,
  addReview: (id) => `${API_BASE_URL}/products/${id}/review`,
  
  // Category endpoints
  categories: `${API_BASE_URL}/categories`,
  categoryFeatured: (category) => `${API_BASE_URL}/categories/${category}/featured`,
  categoryStats: `${API_BASE_URL}/categories/stats`,
  
  // Cart endpoints
  cart: `${API_BASE_URL}/cart`,
  addToCart: `${API_BASE_URL}/cart/add`,
  updateCart: `${API_BASE_URL}/cart/update`,
  removeFromCart: (productId) => `${API_BASE_URL}/cart/remove/${productId}`,
  clearCart: `${API_BASE_URL}/cart/clear`,
  
  // Order endpoints
  orders: `${API_BASE_URL}/orders`,
  orderById: (id) => `${API_BASE_URL}/orders/${id}`,
  cancelOrder: (id) => `${API_BASE_URL}/orders/${id}/cancel`,
  
  // User endpoints
  userProfile: `${API_BASE_URL}/users/profile`,
  userDashboard: `${API_BASE_URL}/users/dashboard`,
  wishlist: `${API_BASE_URL}/users/wishlist`,
  addToWishlist: (productId) => `${API_BASE_URL}/users/wishlist/${productId}`,
  removeFromWishlist: (productId) => `${API_BASE_URL}/users/wishlist/${productId}`,
  
  // Upload endpoints
  uploadImage: `${API_BASE_URL}/upload/image`,
  uploadImages: `${API_BASE_URL}/upload/images`,
  deleteImage: (publicId) => `${API_BASE_URL}/upload/image/${publicId}`,
  
  // Health check
  health: `${API_BASE_URL}/health`
};

// API helper function with error handling
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('crafshi_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // Handle FormData (for file uploads)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('crafshi_token');
        window.location.href = '/login';
      }
      
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific API functions for common operations
export const authAPI = {
  login: async (email, password) => {
    return apiCall(api.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData) => {
    return apiCall(api.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getProfile: async () => {
    return apiCall(api.profile);
  },
  
  updateProfile: async (userData) => {
    return apiCall(api.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
};

export const productAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`${api.products}?${queryString}`);
  },
  
  getById: async (id) => {
    return apiCall(api.productById(id));
  },
  
  getByCategory: async (category, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`${api.productsByCategory(category)}?${queryString}`);
  },
  
  getFeatured: async (limit = 8) => {
    return apiCall(`${api.featuredProducts}?limit=${limit}`);
  },
  
  addReview: async (productId, reviewData) => {
    return apiCall(api.addReview(productId), {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
};

export const cartAPI = {
  get: async () => {
    return apiCall(api.cart);
  },
  
  add: async (productId, quantity = 1) => {
    return apiCall(api.addToCart, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  update: async (productId, quantity) => {
    return apiCall(api.updateCart, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  remove: async (productId) => {
    return apiCall(api.removeFromCart(productId), {
      method: 'DELETE',
    });
  },
  
  clear: async () => {
    return apiCall(api.clearCart, {
      method: 'DELETE',
    });
  }
};

export const orderAPI = {
  create: async (orderData) => {
    return apiCall(api.orders, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`${api.orders}?${queryString}`);
  },
  
  getById: async (id) => {
    return apiCall(api.orderById(id));
  },
  
  cancel: async (id, reason) => {
    return apiCall(api.cancelOrder(id), {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }
};

export default api;