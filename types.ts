export interface CustomFlavor {
  name: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  // Doses and States options
  hasDoses?: boolean;
  priceFullDose?: number;
  priceHalfDose?: number;
  allowStateSelection?: boolean;
  priceReady?: number;
  priceFrozen?: number;
  // Matrix prices for items with both
  priceFullDoseReady?: number;
  priceHalfDoseReady?: number;
  priceFullDoseFrozen?: number;
  priceHalfDoseFrozen?: number;
  // Dynamic Packs (New)
  isDynamicPack?: boolean;
  packSize?: number;
  allowedProducts?: string[]; // Array of product IDs allowed as flavors
  // Multi-size Pack Options
  isMultiSizePack?: boolean;
  price50?: number;
  price100?: number;
  customFlavors?: CustomFlavor[]; // Objects with name and optional image
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  avatar: string;
  isAdmin?: boolean;
}

export type OrderStatus = 'Pendente' | 'Em Produção' | 'Entregue';
export type DeliveryType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  items: CartItem[];
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  deliveryDistance?: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryType: DeliveryType;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress?: string;
  nif?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
}

// Configuração Dinâmica do Site
export interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    buttonText: string;
  };
  promoBanner: {
    title: string;
    text: string;
    image: string;
    buttonText: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    scheduleWeek: string;
    scheduleWeekend: string;
  };
  // Configurações de funcionamento
  businessSettings: {
    closedDay: number; // 0 = Domingo, 1 = Segunda, etc.
    isAcceptingOrders: boolean;
    notAcceptingMessage: string;
  };
}

// Feedback/Avaliações dos Clientes
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  product?: string;
  isApproved: boolean;
}