import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context';
import { ShoppingCart, ArrowLeft, Heart, Share2, MessageCircle, Mail, Phone, X, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

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

// Sistema de recomendações inteligente
const getRecommendations = (currentProduct: Product, allProducts: Product[]): Product[] => {
  const recommendations: Product[] = [];
  
  // Mapeamento de categorias complementares
  const complementaryCategories: Record<string, string[]> = {
    'Bolos de Aniversário': ['Salgados', 'Doces', 'Bebidas', 'Kits Festa'],
    'Salgados': ['Bolos de Aniversário', 'Bebidas', 'Kits Festa', 'Doces'],
    'Kits Festa': ['Bolos de Aniversário', 'Salgados', 'Bebidas', 'Doces'],
    'Doces': ['Bolos de Aniversário', 'Bebidas', 'Salgados', 'Sobremesas'],
    'Bebidas': ['Salgados', 'Doces', 'Bolos de Aniversário', 'Kits Festa'],
    'Sobremesas': ['Bebidas', 'Doces', 'Bolos de Aniversário'],
    'Especiais': ['Bolos de Aniversário', 'Salgados', 'Kits Festa', 'Doces'],
  };

  const complementary = complementaryCategories[currentProduct.category] || [];
  
  // Primeiro, adicionar produtos da mesma categoria (exceto o atual)
  const sameCategory = allProducts.filter(
    p => p.category === currentProduct.category && p.id !== currentProduct.id
  );
  
  // Depois, adicionar produtos de categorias complementares
  const otherCategories = allProducts.filter(
    p => complementary.includes(p.category) && p.id !== currentProduct.id
  );

  // Misturar: 2 da mesma categoria + 4 de categorias complementares
  const sameCategorySample = sameCategory.sort(() => Math.random() - 0.5).slice(0, 2);
  const otherCategoriesSample = otherCategories.sort(() => Math.random() - 0.5).slice(0, 4);
  
  recommendations.push(...sameCategorySample, ...otherCategoriesSample);
  
  // Garantir que temos no máximo 6 recomendações únicas
  return recommendations.slice(0, 6);
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  
  const [quoteModal, setQuoteModal] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Encontrar o produto
  const product = products.find(p => p.id === id);
  
  // Obter recomendações
  const recommendations = product ? getRecommendations(product, products) : [];
  
  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x450/F0EAD6/944D46?text=Rosita+Pastelaria';
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleProductAction = () => {
    if (product?.category === 'Especiais') {
      setQuoteModal({ isOpen: true, product });
    } else {
      handleAddToCart();
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback: copiar URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  // Se o produto não for encontrado
  if (!product) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-serif text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-500 mb-8">O produto que procura não existe ou foi removido.</p>
          <Link 
            to="/produtos"
            className="inline-flex items-center gap-2 bg-gold-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar ao Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gold-600 transition-colors">Início</Link>
          <ChevronRight size={14} />
          <Link to="/produtos" className="hover:text-gold-600 transition-colors">Produtos</Link>
          <ChevronRight size={14} />
          <Link to={`/produtos?categoria=${encodeURIComponent(product.category)}`} className="hover:text-gold-600 transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-cream-50 rounded-2xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Category Badge */}
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
              {product.category}
            </span>
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-gold-600 text-white px-5 py-3 rounded-xl shadow-lg">
              <span className="font-bold text-xl">
                {product.category === 'Especiais' ? (
                  <span className="text-sm">Sob Orçamento</span>
                ) : (
                  <>€{product.price.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-xs font-normal opacity-80">/Kg</span>}</>
                )}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-gold-600 text-sm font-bold uppercase tracking-widest mb-3">
              {product.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              {product.name}
            </h1>
            
            {/* Price (mobile) */}
            <div className="lg:hidden mb-6">
              <span className="inline-block bg-gold-600 text-white font-bold px-6 py-3 rounded-xl text-2xl">
                {product.category === 'Especiais' ? (
                  'Sob Orçamento'
                ) : (
                  <>€{product.price.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-sm font-normal opacity-80">/Kg</span>}</>
                )}
              </span>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Descrição</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
            
            {/* Info adicional baseada na categoria */}
            {product.category === 'Bolos de Aniversário' && (
              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                <p className="text-gold-800 text-sm">
                  <strong>💡 Nota:</strong> O preço indicado é por quilograma. Encomendas personalizadas disponíveis mediante orçamento.
                </p>
              </div>
            )}
            
            {product.category === 'Especiais' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="text-purple-800 text-sm">
                  <strong>✨ Produto Especial:</strong> Este produto é personalizado de acordo com as suas preferências. Contacte-nos para um orçamento à medida.
                </p>
              </div>
            )}
            
            {/* Quantity & Add to Cart */}
            {product.category !== 'Especiais' && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 font-medium text-gray-900 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500 text-sm">
                  Total: <span className="font-bold text-gray-900">€{(product.price * quantity).toFixed(2)}</span>
                </span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleProductAction}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.category === 'Especiais'
                    ? 'bg-gold-600 text-white hover:bg-gold-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {addedToCart ? (
                  <>✓ Adicionado!</>
                ) : product.category === 'Especiais' ? (
                  <><MessageCircle size={22} /> Pedir Orçamento</>
                ) : (
                  <><ShoppingCart size={22} /> Adicionar ao Carrinho</>
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-gold-400 hover:text-gold-600 transition-all"
                title="Partilhar"
              >
                <Share2 size={22} />
              </button>
            </div>
            
            {/* Back Link */}
            <Link 
              to="/produtos"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Voltar ao menu completo
            </Link>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles size={16} />
                Sugestões para si
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                Combine com o seu pedido
              </h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                {product.category === 'Bolos de Aniversário' 
                  ? 'Complete a sua festa com salgados deliciosos e bebidas refrescantes!'
                  : product.category === 'Salgados'
                  ? 'Que tal adicionar um bolo de aniversário ou doces para a sua encomenda?'
                  : 'Descubra outros produtos que combinam perfeitamente com a sua escolha.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((rec) => (
                <Link 
                  key={rec.id} 
                  to={`/produto/${rec.id}`}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={rec.image} 
                      alt={rec.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <div className="absolute top-3 right-3 bg-gold-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                      {rec.category === 'Especiais' ? (
                        'Orçamento'
                      ) : (
                        <>€{rec.price.toFixed(2)}</>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors mb-2">
                      {rec.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {rec.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-gold-600 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                      Ver detalhes <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
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

export default ProductDetail;
