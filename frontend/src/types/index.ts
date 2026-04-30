export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  department: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
  children?: Category[];
  created_at: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_main: boolean;
  created_at: string;
}

export interface CustomizationOption {
  id: number;
  name: string;
  option_type: 'text' | 'image' | 'file';
  is_required: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  category_id: number;
  base_price: number;
  is_customizable: boolean;
  is_active: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  main_image: ProductImage | null;
  customization_options: CustomizationOption[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product_variant: ProductVariant;
  product_variant_id: number;
  quantity: number;
  customization_data: Record<string, any>;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  cost: number;
  estimated_days: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  user: number;
  shipping_address: Record<string, any>;
  shipping_method: ShippingMethod;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  coupon: number | null;
  notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order: number;
  product_variant: ProductVariant;
  quantity: number;
  unit_price: number;
  customization_data: Record<string, any>;
  subtotal: number;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_discount: number | null;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  used_count: number;
  applies_to: 'all' | 'category' | 'product';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  refresh: string;
  access: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  district: string;
  password: string;
  password_confirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}
