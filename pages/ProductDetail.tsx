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
  
  // Pack Salgados - sistema de preços por faixa de quantidade
  // Faixas: 12-24 (€0.50/un), 25-49 (€0.44/un), 50-99 (€0.40/un), 100+ (€0.35/un)
  const getPricePerUnit = (qty: number): number => {
    if (qty >= 100) return 0.35;
    if (qty >= 50) return 0.40;
    if (qty >= 25) return 0.44;
    return 0.50; // 12-24 ou menos
  };
  
  const getPriceTier = (qty: number): string => {
    if (qty >= 100) return '100+';
    if (qty >= 50) return '50-99';
    if (qty >= 25) return '25-49';
    return '12-24';
  };
  
  const getNextTierInfo = (qty: number): { nextTier: number; savings: number } | null => {
    if (qty >= 100) return null;
    if (qty >= 50) return { nextTier: 100, savings: 0.05 };
    if (qty >= 25) return { nextTier: 50, savings: 0.04 };
    if (qty >= 12) return { nextTier: 25, savings: 0.06 };
    return { nextTier: 12, savings: 0 };
  };
  
  // Quantidade total de salgados no pack (mínimo 12)
  const [packQuantity, setPackQuantity] = useState<number>(12);
  const [packQuantityInput, setPackQuantityInput] = useState<string>('12');
  
  // Pack Salgados - Seleção de sabores
  const [flavorSelections, setFlavorSelections] = useState<Record<string, number>>({});
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  
  // Encontrar o produto
  const product = products.find(p => p.id === id);
  
  // Verificar se é Pack Salgados
  const isPackSalgados = product?.category === 'Pack Salgados';
  
  // Obter salgados disponíveis para seleção de sabores no pack
  const availableFlavors = products.filter(p => p.category === 'Salgados');
  
  // Calcular total de sabores selecionados
  const flavorValues = Object.values(flavorSelections) as number[];
  const totalFlavorsSelected: number = flavorValues.reduce((sum, qty) => sum + qty, 0);
  const remainingUnits = packQuantity - totalFlavorsSelected;
  
  // Preço calculado com base na quantidade
  const pricePerUnit = getPricePerUnit(packQuantity);
  const totalPackPrice = packQuantity * pricePerUnit;
  const currentTier = getPriceTier(packQuantity);
  const nextTierInfo = getNextTierInfo(packQuantity);
  
  // Verificar se pode fazer entrega (mínimo 50 unidades para delivery)
  const canDelivery = packQuantity >= 50;
  
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
      // Para Pack Salgados, criar um produto modificado com as unidades no nome e preço correto
      if (isPackSalgados) {
        // Verificar quantidade mínima (12 unidades)
        if (packQuantity < 12) {
          alert('A quantidade mínima para Pack Salgados é de 12 unidades.');
          return;
        }
        
        // Verificar se os sabores foram selecionados corretamente
        if (totalFlavorsSelected !== packQuantity) {
          alert(`Por favor, selecione exatamente ${packQuantity} unidades de sabores. Faltam ${remainingUnits} unidades.`);
          return;
        }
        
        // Verificar se pode fazer entrega
        if (deliveryType === 'delivery' && !canDelivery) {
          alert(`Para entrega ao domicílio, o mínimo é de 50 unidades. Atualmente tem ${packQuantity} unidades selecionadas.`);
          return;
        }
        
        // Criar descrição dos sabores
        const flavorsDescription = Object.entries(flavorSelections)
          .filter(([_, qty]) => (qty as number) > 0)
          .map(([flavorId, qty]) => {
            const flavor = availableFlavors.find(f => f.id === flavorId);
            return `${qty}x ${flavor?.name || 'Desconhecido'}`;
          })
          .join(', ');
        
        const deliveryLabel = deliveryType === 'delivery' ? '🚚 Entrega' : '🏪 Levantamento';
        
        const packProduct = {
          ...product,
          name: `${product.name} (${packQuantity} un.) - ${deliveryLabel}`,
          description: `Sabores: ${flavorsDescription} | Preço: €${pricePerUnit.toFixed(2)}/un`,
          price: totalPackPrice
        };
        addToCart(packProduct);
        
        // Limpar seleções após adicionar
        setFlavorSelections({});
        setPackQuantity(12);
        setPackQuantityInput('12');
      } else {
        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
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
            
            {/* Pack Salgados - Seleção de Unidades */}
            {isPackSalgados && (
              <div className="mb-6 space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-orange-800 text-sm">
                    <strong>📦 Pack de Salgados:</strong> Escolha a quantidade, os sabores e como deseja receber. Quanto maior o pack, melhor o preço por unidade!
                  </p>
                </div>
                
                {/* Tipo de Entrega */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Como deseja receber?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-4 rounded-xl font-medium transition-all border-2 flex flex-col items-center gap-2 ${
                        deliveryType === 'pickup'
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">🏪</span>
                      <span className="font-bold">Levantar na Loja</span>
                      <span className={`text-xs ${deliveryType === 'pickup' ? 'text-blue-100' : 'text-gray-500'}`}>
                        Qualquer quantidade
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        if (canDelivery) {
                          setDeliveryType('delivery');
                        } else {
                          alert(`Para entrega ao domicílio, o mínimo é de 50 unidades. Selecione um pack de 50 ou 100 unidades.`);
                        }
                      }}
                      className={`p-4 rounded-xl font-medium transition-all border-2 flex flex-col items-center gap-2 ${
                        deliveryType === 'delivery'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-lg'
                          : canDelivery
                            ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span className="text-2xl">🚚</span>
                      <span className="font-bold">Entrega ao Domicílio</span>
                      <span className={`text-xs ${deliveryType === 'delivery' ? 'text-rose-100' : canDelivery ? 'text-gray-500' : 'text-gray-400'}`}>
                        Mínimo 50 unidades
                      </span>
                    </button>
                  </div>
                  {!canDelivery && (
                    <p className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      Para entrega ao domicílio, selecione pelo menos 50 unidades.
                    </p>
                  )}
                </div>
                
                {/* Tabela de Preços por Faixa */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Tabela de Preços</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { range: '12-24', price: 0.50, min: 12, max: 24 },
                      { range: '25-49', price: 0.44, min: 25, max: 49 },
                      { range: '50-99', price: 0.40, min: 50, max: 99 },
                      { range: '100+', price: 0.35, min: 100, max: Infinity }
                    ].map((tier) => {
                      const isActive = packQuantity >= tier.min && (tier.max === Infinity ? true : packQuantity <= tier.max);
                      const isBest = tier.range === '100+';
                      
                      return (
                        <div 
                          key={tier.range}
                          className={`relative p-3 rounded-xl text-center border-2 transition-all ${
                            isActive
                              ? isBest 
                                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                                : 'bg-orange-500 text-white border-orange-500 shadow-lg'
                              : isBest
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {isBest && (
                            <span className={`absolute -top-2 -right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-yellow-400 text-green-900' : 'bg-green-500 text-white'
                            }`}>
                              MELHOR
                            </span>
                          )}
                          {tier.min >= 50 && !isBest && (
                            <span className={`absolute -top-2 -left-2 text-[8px] font-bold px-1 py-0.5 rounded-full ${
                              isActive ? 'bg-rose-400 text-white' : 'bg-rose-100 text-rose-600'
                            }`}>
                              🚚
                            </span>
                          )}
                          <div className="text-xs font-medium mb-1">{tier.range}</div>
                          <div className="text-lg font-bold">€{tier.price.toFixed(2)}</div>
                          <div className="text-[10px] opacity-80">/unidade</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Quantidade Total de Unidades */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                    Quantidade de Unidades
                    <span className="ml-2 text-xs font-normal text-gray-500">(mínimo 12)</span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => {
                          const newQty = Math.max(12, packQuantity - 1);
                          if (newQty !== packQuantity) {
                            setPackQuantity(newQty);
                            setPackQuantityInput(String(newQty));
                            setFlavorSelections({});
                            if (newQty < 50 && deliveryType === 'delivery') {
                              setDeliveryType('pickup');
                            }
                          }
                        }}
                        disabled={packQuantity <= 12}
                        className={`px-4 py-3 text-lg font-bold transition-colors ${
                          packQuantity <= 12 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={packQuantityInput}
                        onChange={(e) => {
                          // Permitir apenas números ou vazio
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setPackQuantityInput(value);
                          
                          // Atualizar packQuantity se for um número válido
                          if (value !== '') {
                            const num = parseInt(value);
                            if (!isNaN(num) && num >= 1) {
                              setPackQuantity(Math.max(12, num));
                              setFlavorSelections({});
                              if (num < 50 && deliveryType === 'delivery') {
                                setDeliveryType('pickup');
                              }
                            }
                          }
                        }}
                        onBlur={() => {
                          // Ao sair do campo, garantir mínimo de 12
                          const num = parseInt(packQuantityInput) || 12;
                          const finalQty = Math.max(12, num);
                          setPackQuantity(finalQty);
                          setPackQuantityInput(String(finalQty));
                          setFlavorSelections({});
                          if (finalQty < 50 && deliveryType === 'delivery') {
                            setDeliveryType('pickup');
                          }
                        }}
                        className="w-24 px-2 py-3 text-center font-bold text-xl text-gray-900 border-0 focus:outline-none focus:ring-0"
                      />
                      <button 
                        onClick={() => {
                          const newQty = packQuantity + 1;
                          setPackQuantity(newQty);
                          setPackQuantityInput(String(newQty));
                          setFlavorSelections({});
                        }}
                        className="px-4 py-3 text-lg font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm">
                      <span className={`font-bold text-lg ${packQuantity >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                        €{pricePerUnit.toFixed(2)}
                      </span>
                      <span className="text-gray-500">/unidade</span>
                    </div>
                  </div>
                  
                  {/* Botões rápidos de quantidade */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[12, 25, 50, 100, 150, 200].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => {
                          setPackQuantity(qty);
                          setPackQuantityInput(String(qty));
                          setFlavorSelections({});
                          if (qty < 50 && deliveryType === 'delivery') {
                            setDeliveryType('pickup');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          packQuantity === qty
                            ? qty >= 100 
                              ? 'bg-green-500 text-white'
                              : 'bg-orange-500 text-white'
                            : qty >= 100
                              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {qty} un.
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Dica de economia */}
                {nextTierInfo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>
                        <strong>Dica:</strong> Ao pedir {nextTierInfo.nextTier} unidades ou mais, 
                        paga €{(pricePerUnit - nextTierInfo.savings).toFixed(2)}/un em vez de €{pricePerUnit.toFixed(2)}/un.
                        {nextTierInfo.nextTier === 100 && ' É o melhor preço!'}
                      </span>
                    </p>
                  </div>
                )}
                
                {/* Seleção de Sabores */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                    Escolha os Sabores 
                    <span className={`ml-2 text-xs font-normal px-2 py-1 rounded-full ${
                      remainingUnits === 0 
                        ? 'bg-green-100 text-green-700' 
                        : remainingUnits > 0 
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {remainingUnits === 0 
                        ? '✓ Completo!' 
                        : remainingUnits > 0 
                          ? `Faltam ${remainingUnits} un.`
                          : `${Math.abs(remainingUnits)} un. a mais`}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Selecione {packQuantity} unidades no total. Pode escolher diferentes quantidades de cada sabor.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableFlavors.map((flavor) => {
                      const currentQty = flavorSelections[flavor.id] || 0;
                      
                      return (
                        <div 
                          key={flavor.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            currentQty > 0 
                              ? 'border-orange-300 bg-orange-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={flavor.image} 
                            alt={flavor.name}
                            className="w-14 h-14 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/F0EAD6/944D46?text=🥟';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{flavor.name}</p>
                            <p className="text-xs text-gray-500 truncate">{flavor.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (currentQty > 0) {
                                  setFlavorSelections(prev => ({
                                    ...prev,
                                    [flavor.id]: currentQty - 1
                                  }));
                                }
                              }}
                              disabled={currentQty === 0}
                              className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                                currentQty > 0 
                                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              −
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={currentQty || ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                if (value === '') {
                                  setFlavorSelections(prev => ({
                                    ...prev,
                                    [flavor.id]: 0
                                  }));
                                } else {
                                  const num = parseInt(value);
                                  // Calcular máximo permitido para este sabor
                                  const otherFlavorsTotal = totalFlavorsSelected - currentQty;
                                  const maxAllowed = packQuantity - otherFlavorsTotal;
                                  const finalQty = Math.min(num, maxAllowed);
                                  setFlavorSelections(prev => ({
                                    ...prev,
                                    [flavor.id]: finalQty
                                  }));
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                              className="w-12 text-center font-bold text-gray-900 bg-transparent border border-gray-200 rounded-lg py-1 focus:border-orange-400 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                if (totalFlavorsSelected < packQuantity) {
                                  setFlavorSelections(prev => ({
                                    ...prev,
                                    [flavor.id]: currentQty + 1
                                  }));
                                }
                              }}
                              disabled={totalFlavorsSelected >= packQuantity}
                              className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                                totalFlavorsSelected < packQuantity 
                                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {availableFlavors.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">Nenhum sabor disponível no momento.</p>
                    </div>
                  )}
                </div>
                
                {/* Resumo do Pack */}
                <div className={`rounded-xl p-4 ${packQuantity >= 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Quantidade:</span>
                    <span className="font-bold text-gray-900">{packQuantity} unidades</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Faixa de preço:</span>
                    <span className={`font-bold ${packQuantity >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {currentTier} un. (€{pricePerUnit.toFixed(2)}/un)
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tipo de receção:</span>
                    <span className="font-bold text-gray-900">
                      {deliveryType === 'delivery' ? '🚚 Entrega ao Domicílio' : '🏪 Levantar na Loja'}
                    </span>
                  </div>
                  {totalFlavorsSelected > 0 && (
                    <div className="mb-2">
                      <span className="text-gray-600 text-sm">Sabores selecionados:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(flavorSelections)
                          .filter(([_, qty]) => (qty as number) > 0)
                          .map(([flavorId, qty]) => {
                            const flavor = availableFlavors.find(f => f.id === flavorId);
                            return (
                              <span key={flavorId} className="text-xs bg-white px-2 py-1 rounded-full">
                                {qty}× {flavor?.name}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-800 font-medium">Total de unidades:</span>
                      <span className="font-bold text-orange-600 text-xl">{packQuantity} unidades</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-800 font-medium">Sabores selecionados:</span>
                      <span className={`font-bold text-xl ${remainingUnits === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {totalFlavorsSelected}/{packQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Preço total:</span>
                      <span className="font-bold text-green-600 text-xl">€{totalPackPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quantity & Add to Cart - Para outras categorias */}
            {product.category !== 'Especiais' && !isPackSalgados && (
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
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            
            {/* Sugestão de Pack Salgados para produtos da categoria Salgados */}
            {product.category === 'Salgados' && (() => {
              const packSalgados = products.find(p => p.category === 'Pack Salgados');
              if (!packSalgados) return null;
              
              const unitPriceIndividual = product.price;
              const unitPricePack100 = 0.35; // Preço por unidade no pack de 100
              const savingsPerUnit = unitPriceIndividual - unitPricePack100;
              const savingsPer100 = savingsPerUnit * 100;
              
              return (
                <Link 
                  to={`/produto/${packSalgados.id}`}
                  className="block mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 hover:shadow-lg hover:border-green-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
                      <img 
                        src={packSalgados.image} 
                        alt="Pack Salgados"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💡</span>
                        <span className="text-green-800 font-bold text-sm uppercase tracking-wide">Quer economizar?</span>
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MELHOR PREÇO</span>
                      </div>
                      <p className="text-green-700 text-sm mb-3">
                        Com o <strong>Pack de Salgados</strong> paga apenas <strong>€0.35/unidade</strong> em vez de €{unitPriceIndividual.toFixed(2)}/un.
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-white rounded-lg px-3 py-2 border border-green-200">
                          <div className="text-xs text-gray-500">12 un.</div>
                          <div className="font-bold text-green-600">€6.00</div>
                          <div className="text-[10px] text-gray-400">€0.50/un</div>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 border border-green-200">
                          <div className="text-xs text-gray-500">25 un.</div>
                          <div className="font-bold text-green-600">€11.00</div>
                          <div className="text-[10px] text-gray-400">€0.44/un</div>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 border border-green-200">
                          <div className="text-xs text-gray-500">50 un.</div>
                          <div className="font-bold text-green-600">€20.00</div>
                          <div className="text-[10px] text-gray-400">€0.40/un</div>
                        </div>
                        <div className="bg-green-500 text-white rounded-lg px-3 py-2 relative">
                          <span className="absolute -top-2 -right-1 bg-yellow-400 text-green-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">TOP</span>
                          <div className="text-xs opacity-90">100 un.</div>
                          <div className="font-bold">€35.00</div>
                          <div className="text-[10px] opacity-80">€0.35/un</div>
                        </div>
                      </div>
                      <p className="text-green-600 text-xs mt-3 font-medium">
                        🎉 Poupa até <strong>€{savingsPer100.toFixed(2)}</strong> em cada 100 unidades! Clique para ver o pack.
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })()}
            
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
