import { Product, BlogPost, SiteConfig, Testimonial } from './types';

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
    email: "rositapastelariaofc@gmail.com",
    scheduleWeek: "08:00 - 19:00",
    scheduleWeekend: "09:00 - 13:00"
  },
  businessSettings: {
    closedDay: 1, // Segunda-feira
    isAcceptingOrders: true,
    notAcceptingMessage: "De momento não estamos a aceitar encomendas. Voltaremos em breve!"
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

  // Salgados Congelados
  {
    id: '20',
    name: 'Rissol de Camarão Congelado',
    description: 'Rissol de camarão congelado, pronto para fritar ou cozer no forno.',
    price: 0.95,
    image: 'https://images.unsplash.com/photo-1626698650073-619f5635035e?q=80&w=800&auto=format&fit=crop',
    category: 'Salgados Congelados'
  },
  {
    id: '21',
    name: 'Croquete de Carne Congelada',
    description: 'Croquete de carne congelada, ideal para eventos e festas.',
    price: 0.95,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop',
    category: 'Salgados Congelados'
  },
  {
    id: '22',
    name: 'Empada de Galinha Congelada',
    description: 'Empada de galinha congelada, fresca e saborosa.',
    price: 1.00,
    image: 'https://images.unsplash.com/photo-1628203535284-902242503541?q=80&w=800&auto=format&fit=crop',
    category: 'Salgados Congelados'
  },

  // Pack de Salgados Personalizados
  {
    id: '30',
    name: 'Pack Personalizado de Salgados',
    description: 'Escolha os seus salgados favoritos, fritos ou congelados, e crie o seu próprio pack com o melhor preço por unidade.',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1564759077030-6b83605d4212?q=80&w=800&auto=format&fit=crop',
    category: 'Pack Salgados'
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

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Ana Rodrigues',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Rodrigues&background=D4AF37&color=fff',
    rating: 5,
    text: 'O bolo de aniversário que encomendei para a minha filha ficou simplesmente perfeito! Bonito, saboroso e fresco. A equipa da Rosita foi muito atenciosa e profissional. Recomendo vivamente!',
    date: '10 Dez 2025',
    product: 'Bolo de Aniversário Clássico',
    isApproved: true
  },
  {
    id: '2',
    name: 'João Pereira',
    avatar: 'https://ui-avatars.com/api/?name=Joao+Pereira&background=1a1a1a&color=fff',
    rating: 5,
    text: 'Encomendei os salgados para o batizado do meu filho e todos os convidados adoraram! Os rissóis de camarão estavam divinos. Já é a minha pastelaria de referência para eventos.',
    date: '05 Dez 2025',
    product: 'Box Festa Salgados',
    isApproved: true
  },
  {
    id: '3',
    name: 'Maria Santos',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=8B4513&color=fff',
    rating: 5,
    text: 'Pastelaria com qualidade excecional! Os pastéis de nata são os melhores que já provei em Lisboa. O atendimento é sempre simpático e o ambiente é muito acolhedor.',
    date: '28 Nov 2025',
    product: 'Pastel de Nata',
    isApproved: true
  },
  {
    id: '4',
    name: 'Carlos Martins',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Martins&background=2563eb&color=fff',
    rating: 4,
    text: 'Excelente serviço! Encomendei um kit de festa com pouca antecedência e conseguiram entregar tudo a tempo e com muita qualidade. Os macarons são fantásticos!',
    date: '20 Nov 2025',
    product: 'Kits Festa',
    isApproved: true
  },
  {
    id: '5',
    name: 'Sofia Almeida',
    avatar: 'https://ui-avatars.com/api/?name=Sofia+Almeida&background=ec4899&color=fff',
    rating: 5,
    text: 'O bolo Red Velvet que encomendei para o meu casamento foi um sucesso absoluto! Todos os convidados quiseram saber onde tinha comprado. Obrigada Rosita!',
    date: '15 Nov 2025',
    product: 'Bolo Red Velvet Festivo',
    isApproved: true
  }
];