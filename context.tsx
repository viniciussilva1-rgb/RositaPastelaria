import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, User, Order, SiteConfig, Testimonial, DeliveryType } from './types';
import { INITIAL_PRODUCTS, INITIAL_SITE_CONFIG, INITIAL_TESTIMONIALS } from './constants';

interface DeliveryInfo {
  type: DeliveryType;
  date: string;
  time: string;
  address?: string;
}

interface ShopContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  siteConfig: SiteConfig;
  updateSiteConfig: (config: SiteConfig) => void;

  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  user: User | null;
  login: () => void;
  adminLogin: () => void;
  logout: () => void;
  
  orders: Order[];
  placeOrder: (paymentMethod: string, deliveryInfo: DeliveryInfo) => void;
  getUnavailableDeliverySlots: (date: string) => string[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Products State (Simulating Database)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rosita_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Site Config State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('rosita_site_config');
    return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('rosita_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rosita_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // User State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rosita_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Orders State (Mock Database)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rosita_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('rosita_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rosita_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('rosita_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('rosita_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rosita_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rosita_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rosita_orders', JSON.stringify(orders));
  }, [orders]);

  // Product Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Site Config Actions
  const updateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
  };

  // Testimonial Actions
  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [...prev, testimonial]);
  };

  const updateTestimonial = (updatedTestimonial: Testimonial) => {
    setTestimonials(prev => prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Auth Actions
  const login = () => {
    // Mock User Login
    setUser({
      id: 'u12345',
      name: 'Maria Silva',
      email: 'maria.silva@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Silva&background=D4AF37&color=fff',
      isAdmin: false
    });
  };

  const adminLogin = () => {
    // Mock Admin Login
    setUser({
      id: 'admin01',
      name: 'Rosita Admin',
      email: 'admin@rosita.pt',
      avatar: 'https://ui-avatars.com/api/?name=Rosita+Admin&background=000&color=fff',
      isAdmin: true
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Get unavailable delivery slots for a specific date
  // Returns time slots that are already booked for HOME DELIVERY
  const getUnavailableDeliverySlots = (date: string): string[] => {
    return orders
      .filter(order => 
        order.deliveryDate === date && 
        order.deliveryType === 'delivery' // Only block if it's a delivery
      )
      .map(order => order.deliveryTime);
  };

  const placeOrder = (paymentMethod: string, deliveryInfo: DeliveryInfo) => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `CMD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('pt-PT'),
      items: [...cart],
      total: cartTotal,
      status: 'Pendente',
      paymentMethod,
      deliveryType: deliveryInfo.type,
      deliveryDate: deliveryInfo.date,
      deliveryTime: deliveryInfo.time,
      deliveryAddress: deliveryInfo.address
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    console.log("Order placed:", newOrder);
  };

  return (
    <ShopContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      siteConfig, updateSiteConfig,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      user, login, adminLogin, logout,
      orders, placeOrder, getUnavailableDeliverySlots
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
};