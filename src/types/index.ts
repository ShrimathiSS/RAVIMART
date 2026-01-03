export type Role = 'user' | 'admin';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type Category = 'electrical' | 'hardware' | 'tools' | 'safety' | 'plumbing' | 'lighting';

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  features?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  role: Role;
  joinDate: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Returned';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
}
