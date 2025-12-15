import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Clock, Heart, Quote } from 'lucide-react';
import { useShop } from '../context';

const Home: React.FC = () => {
  const { addToCart, products, siteConfig, testimonials } = useShop();
  
  // Destaques: Apenas 4 produtos para manter clean
  const showcaseProducts = products.slice(0, 4);

  // Apenas testimonials aprovados
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/F0EAD6/944D46?text=Rosita+Pastelaria';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section - Cinematográfica */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteConfig.hero.image} 
            alt="Destaque Rosita" 
            onError={handleImageError}
            className="w-full h-full object-cover opacity-60 animate-slow-zoom"
          />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-fade-in-up">
          <div className="mb-6 flex justify-center">
             <span className="text-white/80 text-xs font-bold uppercase tracking-[0.4em] border-y border-white/30 py-3 px-6 backdrop-blur-sm">
               Desde 1985
             </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight drop-shadow-2xl">
            {siteConfig.hero.title}
          </h1>
          <p className="text-gray-100 text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed tracking-wide opacity-90">
            {siteConfig.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/produtos" className="px-10 py-4 bg-white text-gray-900 rounded-none hover:bg-gold-100 transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold shadow-2xl">
              {siteConfig.hero.buttonText}
            </Link>
            <Link to="/produtos" className="px-10 py-4 border border-white/40 text-white rounded-none hover:bg-white hover:text-gray-900 transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold backdrop-blur-sm">
              Explorar Menu
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </div>

      {/* A Nossa Assinatura (Trust Section) */}
      <div className="py-24 bg-cream-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center p-6">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gold-600 mb-6 shadow-sm">
                    <Star size={24} strokeWidth={1} />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-gray-800">Ingredientes Premium</h3>
                 <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                   Selecionamos apenas manteiga fresca, ovos de campo e chocolate belga para as nossas criações.
                 </p>
              </div>
              <div className="flex flex-col items-center p-6 border-l-0 md:border-l md:border-r border-gold-200">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gold-600 mb-6 shadow-sm">
                    <Heart size={24} strokeWidth={1} />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-gray-800">Feito com Amor</h3>
                 <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                   Cada bolo é decorado à mão pelos nossos chefes pasteleiros com atenção a cada detalhe.
                 </p>
              </div>
              <div className="flex flex-col items-center p-6">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gold-600 mb-6 shadow-sm">
                    <Clock size={24} strokeWidth={1} />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-gray-800">Fresco Todos os Dias</h3>
                 <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                   A nossa vitrine é renovada a cada manhã para garantir a máxima frescura e sabor.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Curadoria (Produtos) - Visual Clean */}
      <div className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16">
            <span className="text-gold-500 text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-3">A Nossa Seleção</span>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center">Favoritos da Casa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {showcaseProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Hover Overlay Minimalista */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <button 
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        className="bg-white text-gray-900 px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                     >
                        Adicionar
                     </button>
                  </div>
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                       {product.category}
                     </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-gold-600 transition-colors">{product.name}</h3>
                  <span className="text-gold-600 font-medium font-serif italic text-lg">€{product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
           
          <div className="mt-20 text-center">
             <Link to="/produtos" className="inline-block border-b border-gray-900 pb-1 text-sm uppercase tracking-widest hover:text-gold-600 hover:border-gold-600 transition-all">
              Ver Coleção Completa
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials / Feedback Section */}
      <div className="py-24 bg-cream-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16">
            <span className="text-gold-500 text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-3">O Que Dizem de Nós</span>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-4">Feedback dos Clientes</h2>
            <p className="text-gray-500 text-center max-w-2xl">
              A satisfação dos nossos clientes é a nossa maior recompensa. Veja o que dizem sobre as nossas criações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {approvedTestimonials.slice(0, 6).map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-gold-200 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Quote size={40} />
                </div>
                
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < testimonial.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200'} 
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Product Tag */}
                {testimonial.product && (
                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200">
                      {testimonial.product}
                    </span>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-center sm:text-left">
                <p className="font-serif text-xl text-gray-900 mb-1">Já experimentou os nossos produtos?</p>
                <p className="text-sm text-gray-500">A sua opinião é muito importante para nós!</p>
              </div>
              <Link 
                to="/cliente" 
                className="px-6 py-3 bg-gold-600 text-white rounded-lg font-medium hover:bg-gold-700 transition-colors whitespace-nowrap"
              >
                Deixar Avaliação
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Imersivo (Parallax Feel) */}
      <div className="relative py-32 bg-fixed bg-center bg-cover reveal" style={{backgroundImage: `url('${siteConfig.promoBanner.image}')`}}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg">{siteConfig.promoBanner.title}</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8 opacity-50"></div>
          <p className="text-white text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-light opacity-90">
            {siteConfig.promoBanner.text}
          </p>
          <Link to="/produtos" className="inline-block bg-white text-gray-900 px-10 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-gold-100 transition-colors shadow-xl">
            {siteConfig.promoBanner.buttonText}
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;