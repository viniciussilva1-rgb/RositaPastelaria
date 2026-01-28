import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Clock, Heart, Quote, X, Send, CheckCircle, MessageCircle, Mail, Phone, AlertCircle } from 'lucide-react';
import { useShop } from '../context';
import { Testimonial } from '../types';

// Modal de Pedido de Orçamento
interface QuoteModalProps {
  product: { name: string; image: string };
  isOpen: boolean;
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ product, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  
  if (!isOpen) return null;

  const whatsappNumber = '351918896857';
  const email = 'rositapastelariaofc@gmail.com';
  
  const handleWhatsApp = () => {
    const text = `Olá! Gostaria de pedir um orçamento para: ${product.name}${message ? `\n\nMensagem: ${message}` : ''}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = `Pedido de Orçamento - ${product.name}`;
    const body = `Olá!\n\nGostaria de pedir um orçamento para: ${product.name}${message ? `\n\nMensagem: ${message}` : ''}\n\nAguardo contacto.\n\nObrigado!`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="relative h-48">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-wider">Pedido de Orçamento</span>
            <h3 className="text-white text-xl font-serif mt-1">{product.name}</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            Este produto é personalizado e requer um orçamento. Deixe-nos uma mensagem ou contacte-nos diretamente.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sua Mensagem (opcional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva o que pretende: quantidade, decoração, data de entrega..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={20} />
              Contactar por WhatsApp
            </button>
            
            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              <Mail size={20} />
              Enviar Email
            </button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-gray-400 mb-1">Ou ligue diretamente:</p>
              <a href="tel:+351918896857" className="inline-flex items-center gap-2 text-gold-600 font-medium hover:text-gold-700">
                <Phone size={16} />
                +351 918 896 857
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { addToCart, products, siteConfig, testimonials, addTestimonial, isOrderingEnabled } = useShop();
  
  const orderingEnabled = isOrderingEnabled();
  
  // Destaques: Apenas 4 produtos para manter clean
  const showcaseProducts = products.slice(0, 4);

  // Apenas testimonials aprovados
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  // Modal de avaliação
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    product: '',
    text: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Modal de orçamento
  const [quoteModal, setQuoteModal] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });

  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/F0EAD6/944D46?text=Rosita+Pastelaria';
  };

  const handleProductAction = (product: any) => {
    if (product.category === 'Especiais') {
      setQuoteModal({ isOpen: true, product });
    } else {
      addToCart(product);
    }
  };

  // Submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.name || !reviewForm.text || reviewForm.rating === 0) {
      alert('Por favor preencha o seu nome, avaliação e comentário.');
      return;
    }

    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: reviewForm.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewForm.name)}&background=D4AF37&color=fff`,
      rating: reviewForm.rating,
      text: reviewForm.text,
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      product: reviewForm.product,
      isApproved: false // Avaliação pendente de aprovação
    };

    addTestimonial(newTestimonial);
    setReviewSubmitted(true);
    
    // Reset após 3 segundos
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);
      setReviewForm({ name: '', email: '', rating: 5, product: '', text: '' });
    }, 3000);
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
               Desde 2019
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

      {/* Banner de Encomendas Pausadas */}
      {!orderingEnabled && (
        <div className="bg-amber-50 border-b border-amber-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 text-lg">Encomendas Temporariamente Indisponíveis</h3>
                <p className="text-amber-700 text-sm">
                  {siteConfig.businessSettings?.notAcceptingMessage || 'De momento não estamos a aceitar encomendas. Voltaremos em breve!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <Link to={`/produto/${product.id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </Link>
                  {/* Hover Overlay Minimalista */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                     <Link 
                        to={`/produto/${product.id}`}
                        className="px-6 py-3 bg-white text-gray-900 uppercase text-xs font-bold tracking-widest hover:bg-gray-100 transition-colors"
                     >
                        Ver Detalhes
                     </Link>
                     {orderingEnabled ? (
                       <button 
                          onClick={(e) => { e.preventDefault(); handleProductAction(product); }}
                          className={`px-6 py-3 uppercase text-xs font-bold tracking-widest transition-colors ${
                            product.category === 'Especiais'
                              ? 'bg-gold-500 text-white hover:bg-gold-600'
                              : 'bg-gray-900 text-white hover:bg-gold-600'
                          }`}
                       >
                          {product.category === 'Especiais' ? 'Pedir Orçamento' : 'Adicionar'}
                       </button>
                     ) : (
                       <div className="px-6 py-3 bg-gray-400 text-white uppercase text-xs font-bold tracking-widest cursor-not-allowed">
                         Indisponível
                       </div>
                     )}
                  </div>
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                       {product.category}
                     </span>
                  </div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <Link to={`/produto/${product.id}`} className="mb-4 block h-14 flex items-center justify-center">
                    <h3 className="text-lg md:text-xl font-serif text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2 leading-tight px-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto">
                    <span className="inline-block bg-gold-600 text-white font-bold px-5 py-2 rounded-full text-base whitespace-nowrap shadow-sm">
                      {product.category === 'Especiais' ? (
                        'Sob Orçamento'
                      ) : (
                        <>€{product.price.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-xs text-gold-100 font-normal ml-0.5">/Kg</span>}</>
                      )}
                    </span>
                  </div>
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

      {/* Modal de Orçamento */}
      {quoteModal.product && (
        <QuoteModal
          product={quoteModal.product}
          isOpen={quoteModal.isOpen}
          onClose={() => setQuoteModal({ isOpen: false, product: null })}
        />
      )}

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
              <button 
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-gold-600 text-white rounded-lg font-medium hover:bg-gold-700 transition-colors whitespace-nowrap"
              >
                Deixar Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Avaliação do Cliente */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !reviewSubmitted && setShowReviewModal(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto">
            
            {/* Success State */}
            {reviewSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Obrigado pela sua avaliação!</h3>
                <p className="text-gray-500">A sua opinião será analisada e publicada em breve.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Deixe a sua Avaliação</h3>
                      <p className="text-gold-100 text-sm">Partilhe a sua experiência connosco</p>
                    </div>
                    <button 
                      onClick={() => setShowReviewModal(false)}
                      className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">O seu nome *</label>
                    <input 
                      type="text" 
                      required
                      value={reviewForm.name}
                      onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                      placeholder="Ex: Maria Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (opcional)</label>
                    <input 
                      type="email" 
                      value={reviewForm.email}
                      onChange={e => setReviewForm({...reviewForm, email: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                      placeholder="exemplo@email.com"
                    />
                    <p className="text-xs text-gray-400 mt-1">Não será publicado, apenas para contacto se necessário.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">A sua avaliação *</label>
                    <div className="flex items-center gap-1 p-3 bg-gray-50 rounded-lg">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star 
                            size={32} 
                            className={star <= reviewForm.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'} 
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-500 font-medium">
                        {reviewForm.rating === 1 && 'Fraco'}
                        {reviewForm.rating === 2 && 'Razoável'}
                        {reviewForm.rating === 3 && 'Bom'}
                        {reviewForm.rating === 4 && 'Muito Bom'}
                        {reviewForm.rating === 5 && 'Excelente'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Produto (opcional)</label>
                    <select 
                      value={reviewForm.product}
                      onChange={e => setReviewForm({...reviewForm, product: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none bg-white"
                    >
                      <option value="">Selecione um produto...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">O seu comentário *</label>
                    <textarea 
                      required
                      rows={4}
                      value={reviewForm.text}
                      onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none resize-none"
                      placeholder="Conte-nos a sua experiência com os nossos produtos..."
                    />
                  </div>

                  <div className="bg-cream-50 p-4 rounded-lg border border-cream-200">
                    <p className="text-xs text-gray-500">
                      📝 A sua avaliação será revista pela nossa equipa antes de ser publicada. Agradecemos a sua paciência!
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gold-600 text-white rounded-lg font-medium hover:bg-gold-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Enviar Avaliação
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

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