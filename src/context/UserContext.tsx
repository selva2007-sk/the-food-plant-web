import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order } from '../types';

interface Toast {
  message: string;
  type: 'success' | 'info' | 'error';
  subMessage?: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, name: string, address?: User['address'], phone?: string) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  addOrder: (order: Order) => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  toast: Toast | null;
  showToast: (message: string, type?: Toast['type'], subMessage?: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('food_planet_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'success', subMessage?: string) => {
    setToast({ message, type, subMessage });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (email: string, name: string, address?: User['address'], phone?: string) => {
    const newUser: User = {
      name,
      email,
      phone,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      address,
      wishlist: [],
      orders: [],
      notifications: {
        push: true,
        sms: false,
        orderUpdates: true,
        promotions: false,
      }
    };
    setUser(newUser);
    localStorage.setItem('food_planet_user', JSON.stringify(newUser));
    setIsAuthOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('food_planet_user');
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    const isRemoving = user.wishlist.includes(productId);
    const newWishlist = isRemoving
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];

    const updatedUser = { ...user, wishlist: newWishlist };
    setUser(updatedUser);
    localStorage.setItem('food_planet_user', JSON.stringify(updatedUser));

    showToast(
      isRemoving ? 'Removed from Wishlist' : 'Added to Wishlist',
      isRemoving ? 'info' : 'success'
    );
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    const updatedUser = { ...user, orders: [order, ...user.orders] };
    setUser(updatedUser);
    localStorage.setItem('food_planet_user', JSON.stringify(updatedUser));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('food_planet_user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      toggleWishlist, 
      addOrder, 
      updateProfile, 
      isAuthOpen, 
      setIsAuthOpen,
      toast,
      showToast
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
