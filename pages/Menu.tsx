import React, { useState } from 'react';
import { useShop } from '../context';
import { ShoppingCart, MessageCircle, Mail, Phone, X } from 'lucide-react';

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

const Menu: React.FC = () => {
  const { addToCart, products } = useShop();
  const [filter, setFilter] = useState<string>('Todos');
  const [quoteModal, setQuoteModal] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });
  
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = filter === 'Todos' 
    ? products 
    : products.filter(p => p.category === filter);

  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x450/F0EAD6/944D46?text=Rosita+Pastelaria';
  };

  const handleProductAction = (product: any) => {
    if (product.category === 'Especiais') {
      setQuoteModal({ isOpen: true, product });
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold-600 text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-4 block">Pastelaria Artesanal</span>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6">A Nossa Coleção</h1>
          <div className="w-16 h-[2px] bg-gray-200 mx-auto"></div>
        </div>

        {/* Minimalist Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`pb-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                filter === cat 
                ? 'text-gray-900 border-b-2 border-gold-500' 
                : 'text-gray-400 border-b-2 border-transparent hover:text-gold-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {filteredProducts.map(product => (
            <div key={product.id} className="group">
              <div className="relative h-[450px] overflow-hidden mb-6 bg-cream-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Always Visible Price Tag - Elegant */}
                <div className="absolute top-0 right-0 bg-gold-600 px-5 py-3 shadow-lg">
                   <span className="font-bold text-white text-lg">
                     {product.category === 'Especiais' ? (
                       <span className="text-sm">Sob Orçamento</span>
                     ) : (
                       <>€{product.price.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-xs text-gold-100 font-normal">/Kg</span>}</>
                     )}
                   </span>
                </div>

                {/* Add to Cart / Quote Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-end">
                   <button 
                    onClick={() => handleProductAction(product)}
                    className={`w-full py-3 uppercase text-[10px] font-bold tracking-widest transition-colors flex items-center justify-center gap-2 ${
                      product.category === 'Especiais' 
                        ? 'bg-gold-500 text-white hover:bg-gold-600' 
                        : 'bg-white text-gray-900 hover:bg-gold-500 hover:text-white'
                    }`}
                  >
                    {product.category === 'Especiais' ? (
                      <><MessageCircle size={14} /> Pedir Orçamento</>
                    ) : (
                      <><ShoppingCart size={14} /> Adicionar ao Carrinho</>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-center px-4">
                <span className="block text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-2">
                  {product.category}
                </span>
                <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-gold-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-serif italic">
            Não existem produtos nesta categoria de momento.
          </div>
        )}

      </div>

      {/* Modal de Orçamento */}
      {quoteModal.product && (
        <QuoteModal
          product={quoteModal.product}
          isOpen={quoteModal.isOpen}
          onClose={() => setQuoteModal({ isOpen: false, product: null })}
        />
      )}
    </div>
  );
};

export default Menu;