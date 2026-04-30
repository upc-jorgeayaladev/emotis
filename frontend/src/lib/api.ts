import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthResponse, User, Product, Category, Cart, CartItem, ShippingMethod, Order, Coupon } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Log error for debugging
        if (error.response) {
          console.error('API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('API No Response:', error.message, error.code);
        } else {
          console.error('API Error:', error.message);
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/token/refresh/`, {
                refresh: refreshToken,
              });
              const { access } = response.data;
              localStorage.setItem('access_token', access);
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Auth endpoints
  async register(data: any): Promise<AuthResponse> {
    const response = await this.client.post('/users/register/', data);
    return response.data;
  }

  async login(data: any): Promise<AuthResponse> {
    const response = await this.client.post('/users/login/', data);
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.client.post('/users/logout/', { refresh: refreshToken });
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get('/users/profile/');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put('/users/profile/', data);
    return response.data;
  }

  // Products endpoints
  async getCategories(): Promise<Category[]> {
    const response = await this.client.get('/products/categories/');
    return response.data.results || response.data;
  }

  async getProducts(params?: any): Promise<{ results: Product[]; count: number }> {
    const response = await this.client.get('/products/products/', { params });
    return response.data;
  }

  async getProduct(slug: string): Promise<Product> {
    const response = await this.client.get(`/products/products/${slug}/`);
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response = await this.client.get('/carts/cart/');
    return response.data;
  }

  async addToCart(data: { product_variant_id: number; quantity: number; customization_data?: any }): Promise<CartItem> {
    const response = await this.client.post('/carts/items/', data);
    return response.data;
  }

  async updateCartItem(id: number, data: { quantity: number }): Promise<CartItem> {
    const response = await this.client.put(`/carts/items/${id}/`, data);
    return response.data;
  }

  async removeCartItem(id: number): Promise<void> {
    await this.client.delete(`/carts/items/${id}/`);
  }

  async clearCart(): Promise<void> {
    await this.client.delete('/carts/clear/');
  }

  // Orders endpoints
  async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await this.client.get('/orders/shipping-methods/');
    return response.data.results || response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.client.get('/orders/orders/');
    return response.data.results || response.data;
  }

  async createOrder(data: any): Promise<Order> {
    const response = await this.client.post('/orders/orders/', data);
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await this.client.get(`/orders/orders/${id}/`);
    return response.data;
  }

  // Coupons
  async validateCoupon(code: string): Promise<Coupon> {
    const response = await this.client.post('/coupons/validate/', { code });
    return response.data;
  }
}

export const api = ApiClient.getInstance();
