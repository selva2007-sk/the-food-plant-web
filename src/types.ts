export interface User {
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  address?: {
    street: string;
    city: string;
    zip: string;
  };
  wishlist: string[]; // Array of product IDs
  orders: Order[];
  notifications: {
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
}

export type OrderStatus = 'confirmed' | 'shipping' | 'delivered';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  trackingSteps: {
    status: OrderStatus;
    label: string;
    date: string;
    isCompleted: boolean;
  }[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  weight: string;
  rating: number;
  reviews: Review[];
  ingredients?: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
