import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product, User, Order, SiteConfig, Testimonial, DeliveryType, BlogPost } from './types';
import { INITIAL_PRODUCTS, INITIAL_SITE_CONFIG, INITIAL_TESTIMONIALS, BLOG_POSTS } from './constants';
import { db, COLLECTIONS, firestoreHelpers, authHelpers, ADMIN_EMAIL, FirebaseUser } from './services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Categorias iniciais
const INITIAL_CATEGORIES = ['Bolos de Aniversário', 'Salgados', 'Kits Festa', 'Doces', 'Bebidas', 'Sobremesas', 'Especiais'];

interface DeliveryInfo {
  type: DeliveryType;
  date: string;
  time: string;
  address?: string;
  deliveryFee?: number;
  distance?: number;
  nif?: string;
}

interface ShopContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  categories: string[];
  addCategory: (category: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (category: string) => void;
  
  siteConfig: SiteConfig;
  updateSiteConfig: (config: SiteConfig) => void;

  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  orders: Order[];
  placeOrder: (paymentMethod: string, deliveryInfo: DeliveryInfo) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
  getUnavailableDeliverySlots: (date: string) => string[];
  isOrderingEnabled: () => boolean;
  getClosedDayName: () => string;
  isDateClosed: (date: Date) => boolean;
  
  isLoading: boolean;
  authLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Categories State
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);

  // Site Config State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);

  // Cart State (local only - per user)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rosita_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // User State - now derived from Firebase Auth
  const [user, setUser] = useState<User | null>(null);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = authHelpers.onAuthChange((fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && fbUser.email === ADMIN_EMAIL) {
        setUser({
          id: fbUser.uid,
          name: 'Rosita Admin',
          email: fbUser.email,
          isAdmin: true
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize data from Firebase and set up real-time listeners
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Check if DB is already initialized by checking siteConfig
        const configSnapshot = await onSnapshot(doc(db, COLLECTIONS.SITE_CONFIG, 'main'), async (snapshot) => {
          if (!snapshot.exists()) {
            console.log('Firebase empty or first run, initializing with default data...');
            
            // Upload initial products
            for (const product of INITIAL_PRODUCTS) {
              await firestoreHelpers.set(COLLECTIONS.PRODUCTS, product);
            }
            
            // Upload initial categories
            await setDoc(doc(db, COLLECTIONS.CATEGORIES, 'main'), { list: INITIAL_CATEGORIES });
            
            // Upload initial site config
            await setDoc(doc(db, COLLECTIONS.SITE_CONFIG, 'main'), INITIAL_SITE_CONFIG);
            
            // Upload initial testimonials
            for (const testimonial of INITIAL_TESTIMONIALS) {
              await firestoreHelpers.set(COLLECTIONS.TESTIMONIALS, testimonial);
            }
            
            // Upload initial blog posts
            for (const post of BLOG_POSTS) {
              await firestoreHelpers.set(COLLECTIONS.BLOG_POSTS, post);
            }
            
            console.log('Firebase initialized with default data!');
          }
          setIsInitialized(true);
        }, (err) => {
          console.error('Error checking initialization:', err);
          setIsInitialized(true); // Proceed anyway to show local data if FB fails
        });

        return () => configSnapshot();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  // Real-time listeners for Firebase data
  useEffect(() => {
    if (!isInitialized) return;

    const unsubscribes: (() => void)[] = [];

    // Products listener
    const unsubProducts = firestoreHelpers.subscribe<Product>(COLLECTIONS.PRODUCTS, (data) => {
      setProducts(data);
    });
    unsubscribes.push(unsubProducts);

    // Categories listener
    const unsubCategories = onSnapshot(doc(db, COLLECTIONS.CATEGORIES, 'main'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.list) {
          setCategories(data.list);
        }
      }
    });
    unsubscribes.push(unsubCategories);

    // Site Config listener
    const unsubSiteConfig = onSnapshot(doc(db, COLLECTIONS.SITE_CONFIG, 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteConfig(snapshot.data() as SiteConfig);
      }
    });
    unsubscribes.push(unsubSiteConfig);

    // Testimonials listener
    const unsubTestimonials = firestoreHelpers.subscribe<Testimonial>(COLLECTIONS.TESTIMONIALS, (data) => {
      setTestimonials(data);
    });
    unsubscribes.push(unsubTestimonials);

    // Blog Posts listener
    const unsubBlogPosts = firestoreHelpers.subscribe<BlogPost>(COLLECTIONS.BLOG_POSTS, (data) => {
      setBlogPosts(data);
    });
    unsubscribes.push(unsubBlogPosts);

    // Orders listener
    const unsubOrders = firestoreHelpers.subscribe<Order>(COLLECTIONS.ORDERS, (data) => {
      setOrders(data.sort((a, b) => {
        // Sort by date descending
        return new Date(b.date.split('/').reverse().join('-')).getTime() - 
               new Date(a.date.split('/').reverse().join('-')).getTime();
      }));
    });
    unsubscribes.push(unsubOrders);

    // Set loading to false after a small delay to allow first snapshot
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup listeners on unmount
    return () => {
      unsubscribes.forEach(unsub => unsub());
      clearTimeout(timer);
    };
  }, [isInitialized]);

  // Local persistence for cart
  useEffect(() => {
    localStorage.setItem('rosita_cart', JSON.stringify(cart));
  }, [cart]);

  // Local persistence for user
  useEffect(() => {
    if (user) {
      localStorage.setItem('rosita_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rosita_user');
    }
  }, [user]);

  // Category Actions
  const addCategory = useCallback(async (category: string) => {
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      await setDoc(doc(db, COLLECTIONS.CATEGORIES, 'main'), { list: newCategories });
    }
  }, [categories]);

  const updateCategory = useCallback(async (oldName: string, newName: string) => {
    const newCategories = categories.map(c => c === oldName ? newName : c);
    setCategories(newCategories);
    await setDoc(doc(db, COLLECTIONS.CATEGORIES, 'main'), { list: newCategories });
    
    // Update products with the old category
    const updatedProducts = products.map(p => 
      p.category === oldName ? { ...p, category: newName } : p
    );
    for (const product of updatedProducts.filter(p => p.category === newName)) {
      await firestoreHelpers.set(COLLECTIONS.PRODUCTS, product);
    }
  }, [categories, products]);

  const deleteCategory = useCallback(async (category: string) => {
    const newCategories = categories.filter(c => c !== category);
    setCategories(newCategories);
    await setDoc(doc(db, COLLECTIONS.CATEGORIES, 'main'), { list: newCategories });
  }, [categories]);

  // Product Actions
  const addProduct = useCallback(async (product: Product) => {
    await firestoreHelpers.set(COLLECTIONS.PRODUCTS, product);
  }, []);

  const updateProduct = useCallback(async (updatedProduct: Product) => {
    await firestoreHelpers.set(COLLECTIONS.PRODUCTS, updatedProduct);
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    await firestoreHelpers.delete(COLLECTIONS.PRODUCTS, productId);
  }, []);

  // Site Config Actions
  const updateSiteConfig = useCallback(async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    await setDoc(doc(db, COLLECTIONS.SITE_CONFIG, 'main'), newConfig);
  }, []);

  // Testimonial Actions
  const addTestimonial = useCallback(async (testimonial: Testimonial) => {
    await firestoreHelpers.set(COLLECTIONS.TESTIMONIALS, testimonial);
  }, []);

  const updateTestimonial = useCallback(async (updatedTestimonial: Testimonial) => {
    await firestoreHelpers.set(COLLECTIONS.TESTIMONIALS, updatedTestimonial);
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    await firestoreHelpers.delete(COLLECTIONS.TESTIMONIALS, id);
  }, []);

  // Blog Post Actions
  const addBlogPost = useCallback(async (post: BlogPost) => {
    await firestoreHelpers.set(COLLECTIONS.BLOG_POSTS, post);
  }, []);

  const updateBlogPost = useCallback(async (updatedPost: BlogPost) => {
    await firestoreHelpers.set(COLLECTIONS.BLOG_POSTS, updatedPost);
  }, []);

  const deleteBlogPost = useCallback(async (id: string) => {
    await firestoreHelpers.delete(COLLECTIONS.BLOG_POSTS, id);
  }, []);

  // Cart Actions (local only)
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
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
    // Login de cliente normal (não usado, mantido para compatibilidade)
    setUser({
      id: 'u12345',
      name: 'Maria Silva',
      email: 'maria.silva@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Silva&background=D4AF37&color=fff',
      isAdmin: false
    });
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const fbUser = await authHelpers.login(email, password);
      if (fbUser.email === ADMIN_EMAIL) {
        // User state will be set by the auth listener
        return true;
      } else {
        // Not admin, logout
        await authHelpers.logout();
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authHelpers.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Order Actions
  const getUnavailableDeliverySlots = (date: string): string[] => {
    return orders
      .filter(order => 
        order.deliveryDate === date && 
        order.deliveryType === 'delivery'
      )
      .map(order => order.deliveryTime);
  };

  const placeOrder = useCallback(async (paymentMethod: string, deliveryInfo: DeliveryInfo) => {
    if (cart.length === 0) return;
    
    const deliveryFee = deliveryInfo.deliveryFee || 0;
    const totalWithDelivery = cartTotal + deliveryFee;
    
    const newOrder: Order = {
      id: `CMD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('pt-PT'),
      items: [...cart],
      total: totalWithDelivery,
      subtotal: cartTotal,
      deliveryFee: deliveryFee,
      deliveryDistance: deliveryInfo.distance,
      status: 'Pendente',
      paymentMethod,
      deliveryType: deliveryInfo.type,
      deliveryDate: deliveryInfo.date,
      deliveryTime: deliveryInfo.time,
      deliveryAddress: deliveryInfo.address,
      nif: deliveryInfo.nif
    };

    await firestoreHelpers.set(COLLECTIONS.ORDERS, newOrder);
    clearCart();
    console.log("Order placed:", newOrder);
  }, [cart, cartTotal]);

  const updateOrder = useCallback(async (updatedOrder: Order) => {
    await firestoreHelpers.set(COLLECTIONS.ORDERS, updatedOrder);
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    await firestoreHelpers.delete(COLLECTIONS.ORDERS, orderId);
  }, []);

  // Business Settings helpers
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const isOrderingEnabled = (): boolean => {
    return siteConfig.businessSettings?.isAcceptingOrders !== false;
  };

  const getClosedDayName = (): string => {
    const closedDay = siteConfig.businessSettings?.closedDay ?? 0;
    return dayNames[closedDay];
  };

  const isDateClosed = (date: Date): boolean => {
    const closedDay = siteConfig.businessSettings?.closedDay ?? 0;
    return date.getDay() === closedDay;
  };

  return (
    <ShopContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      siteConfig, updateSiteConfig,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      user, firebaseUser, login, adminLogin, logout,
      orders, placeOrder, updateOrder, deleteOrder, getUnavailableDeliverySlots,
      isOrderingEnabled, getClosedDayName, isDateClosed,
      isLoading, authLoading
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