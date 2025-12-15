import { Product, BlogPost, SiteConfig } from './types';

export const INITIAL_SITE_CONFIG: SiteConfig = {
  hero: {
    title: "A Alma da Sua Festa",
    subtitle: "Especialistas em bolos de aniversário personalizados e nos melhores salgados para os seus eventos. Tornamos cada celebração inesquecível.",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=2000&auto=format&fit=crop",
    buttonText: "Encomendar para Festa"
  },
  promoBanner: {
    title: "Vai dar uma festa?",
    text: "Deixe o trabalho connosco. Preparámos kits especiais com bolo, salgados e doces para que só tenha de se preocupar em receber os convidados.",
    image: "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?q=80&w=2000&auto=format&fit=crop",
    buttonText: "Ver Kits de Festa"
  },
  contact: {
    address: "Rua da Doçura, 123, Lisboa",
    phone: "+351 210 000 000",
    email: "festas@rosita.pt",
    scheduleWeek: "08:00 - 19:00",
    scheduleWeekend: "09:00 - 13:00"
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  // Bolos de Aniversário & Festas
  {
    id: '11',
    name: 'Bolo de Aniversário Clássico',
    description: 'Pão de ló fofo com recheio de doce de ovo e cobertura de amêndoa torrada.',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=800&auto=format&fit=crop',
    category: 'Bolos de Aniversário'
  },
  {
    id: '12',
    name: 'Bolo Red Velvet Festivo',
    description: 'Bolo vermelho aveludado com camadas de cream cheese, ideal para celebrações.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1586788680434-30d324436962?q=80&w=800&auto=format&fit=crop',
    category: 'Bolos de Aniversário'
  },
  {
    id: '13',
    name: 'Box Festa Salgados (50 unid.)',
    description: 'Sortido de mini rissóis de camarão, carne, coxinhas e croquetes para a sua festa.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1564759077030-6b83605d4212?q=80&w=800&auto=format&fit=crop',
    category: 'Kits Festa'
  },
  
  // Salgados Individuais
  {
    id: '7',
    name: 'Rissol de Camarão',
    description: 'Massa caseira fina com recheio cremoso de camarão.',
    price: 1.40,
    image: 'https://images.unsplash.com/photo-1626698650073-619f5635035e?q=80&w=800&auto=format&fit=crop',
    category: 'Salgados'
  },
  {
    id: '9',
    name: 'Croquete de Carne Artesanal',
    description: 'Receita tradicional com carne estufada lentamente.',
    price: 1.40,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop',
    category: 'Salgados'
  },
  {
    id: '8',
    name: 'Empada de Galinha',
    description: 'Massa quebrada que se desfaz na boca.',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1628203535284-902242503541?q=80&w=800&auto=format&fit=crop',
    category: 'Salgados'
  },

  // Doces Tradicionais
  {
    id: '1',
    name: 'Pastel de Nata',
    description: 'O clássico cremoso e estaladiço, indispensável em qualquer mesa.',
    price: 1.20,
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800&auto=format&fit=crop',
    category: 'Doces'
  },
  {
    id: '5',
    name: 'Macarons (Caixa de 12)',
    description: 'Elegância para a sua festa. Sabores sortidos.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=800&auto=format&fit=crop',
    category: 'Doces'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Como escolher o bolo de aniversário perfeito',
    excerpt: 'Dicas para calcular o tamanho e escolher os sabores que agradam a todos os convidados.',
    date: '15 Nov 2023',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=800&auto=format&fit=crop',
    content: '...'
  },
  {
    id: '2',
    title: 'Salgados fritos ou de forno para a sua festa?',
    excerpt: 'Descubra qual a melhor opção para o tipo de evento que está a planear.',
    date: '02 Nov 2023',
    image: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?q=80&w=800&auto=format&fit=crop',
    content: '...'
  },
  {
    id: '3',
    title: 'Encomendas de Natal e Fim de Ano',
    excerpt: 'A agenda já está aberta. Garanta os seus salgados e Bolo Rei.',
    date: '20 Out 2023',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    content: '...'
  }
];