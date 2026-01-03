import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product, Order, OrderStatus } from '../types';
import { useAuth } from './AuthContext';

interface CartStats {
  addToCartCount: number;
  ordersPlacedCount: number;
  totalRevenue: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: Order[];
  placeOrder: (paymentMethod: string, shippingDetails?: any) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  stats: CartStats;
  showToast: boolean;
  toastMessage: string;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<CartStats>({ addToCartCount: 0, ordersPlacedCount: 0, totalRevenue: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { user } = useAuth();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addToCart = (product: Product) => {
    setStats(prev => ({ ...prev, addToCartCount: prev.addToCartCount + 1 }));
    triggerToast(`Added ${product.name} to cart`);
    
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const placeOrder = (paymentMethod: string, shippingDetails?: any) => {
    if (!user) return null;
    
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substr(2, 2).toUpperCase()}`;
    
    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      items: [...cart],
      total: cartTotal,
      status: 'Pending',
      date: new Date().toISOString(),
      paymentMethod,
      shippingAddress: shippingDetails || {
        name: user.name,
        address: '123 Industrial Area',
        city: 'Mumbai',
        zip: '400001'
      }
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    setStats(prev => ({ 
      ...prev, 
      ordersPlacedCount: prev.ordersPlacedCount + 1,
      totalRevenue: prev.totalRevenue + cartTotal
    }));
    
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    triggerToast(`Order #${orderId} updated to ${status}`);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        orders,
        placeOrder,
        updateOrderStatus,
        stats,
        showToast,
        toastMessage,
        hideToast: () => setShowToast(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
