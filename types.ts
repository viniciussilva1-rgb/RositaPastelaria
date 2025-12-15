export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin?: boolean;
}

export type OrderStatus = 'Pendente' | 'Em Produção' | 'Entregue';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
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
}