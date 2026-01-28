import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context';
import { ShoppingCart, ArrowLeft, Heart, Share2, MessageCircle, Mail, Phone, X, ChevronRight, Sparkles, AlertCircle, Store, Truck } from 'lucide-react';
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
  const { products, addToCart, isOrderingEnabled, siteConfig, testimonials = [] } = useShop();
  
  const orderingEnabled = isOrderingEnabled();
  
  const [quoteModal, setQuoteModal] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Pack Salgados - Novo sistema de packs pré-definidos
  const predefinedPacks = {
    50: {
      fritos: { price: 20, label: '50 Salgados Fritos' },
      congelados: { price: 16.50, label: '50 Salgados Congelados' }
    },
    100: {
      fritos: { price: 38, label: '100 Salgados Fritos' },
      congelados: { price: 33, label: '100 Salgados Congelados' }
    }
  };

  const [selectedPackUnits, setSelectedPackUnits] = useState<50 | 100>(50);
  const [selectedPackType, setSelectedPackType] = useState<'fritos' | 'congelados'>('fritos');
  const [currentStep, setCurrentStep] = useState(1);

  // Opções para "Pronto para Comer"
  const [selectedDose, setSelectedDose] = useState<'full' | 'half'>('full');
  const [selectedState, setSelectedState] = useState<'ready' | 'frozen'>('ready');

  // Pack Salgados - Seleção de sabores
  const [flavorSelections, setFlavorSelections] = useState<Record<string, number>>({});
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  
  // Encontrar o produto
  const product = products.find(p => p.id === id);
  
  // Verificar se é Pack Salgados ou Pack Dinâmico
  const isPackSalgados = product?.category === 'Pack Salgados' || 
                       product?.name.toLowerCase().includes('pack de salgados') ||
                       product?.id === '30';
  
  const isDynamicPack = product?.isDynamicPack;
  const isAnyPack = isPackSalgados || isDynamicPack;

  // Verificar se tem doses ou estados
  const isProntoParaComer = product?.category === 'Pronto para Comer' || product?.hasDoses || product?.allowStateSelection;

  // Calcular preço dinâmico
  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (isAnyPack) {
       return isDynamicPack ? (product.price || 0) : predefinedPacks[selectedPackUnits][selectedPackType].price;
    }
    if (!isProntoParaComer) return product.price;

    const hasDoses = product.hasDoses || product.category === 'Pronto para Comer';
    const allowState = product.allowStateSelection || product.category === 'Pronto para Comer';

    if (hasDoses && allowState) {
      if (selectedDose === 'full' && selectedState === 'ready') return product.priceFullDoseReady || product.price;
      if (selectedDose === 'half' && selectedState === 'ready') return product.priceHalfDoseReady || product.price * 0.6;
      if (selectedDose === 'full' && selectedState === 'frozen') return product.priceFullDoseFrozen || product.price * 0.9;
      if (selectedDose === 'half' && selectedState === 'frozen') return product.priceHalfDoseFrozen || product.price * 0.55;
    } else if (hasDoses) {
      if (selectedDose === 'full') return product.priceFullDose || product.price;
      if (selectedDose === 'half') return product.priceHalfDose || product.price * 0.6;
    } else if (allowState) {
      if (selectedState === 'ready') return product.priceReady || product.price;
      if (selectedState === 'frozen') return product.priceFrozen || product.price * 0.9;
    }

    return product.price;
  }, [product, selectedDose, selectedState, isProntoParaComer, isAnyPack, isDynamicPack, selectedPackUnits, selectedPackType]);
  
  // Obter produtos permitidos para o pack dinâmico
  const allowedPackProducts = useMemo(() => {
    if (!product?.allowedProducts || !products) return [];
    return products.filter(p => product.allowedProducts?.includes(p.id));
  }, [product, products]);

  // Obter salgados disponíveis para seleção de sabores no pack salgados
  const availableFriedSalgados = products.filter(p => p.category === 'Salgados');
  const availableFrozenSalgados = products.filter(p => p.category === 'Salgados Congelados');
  
  // Filtrar sabores de acordo com o tipo de pack selecionado
  const availableFlavors = isDynamicPack ? allowedPackProducts : (selectedPackType === 'fritos' ? availableFriedSalgados : availableFrozenSalgados);
  
  // Calcular total de sabores selecionados
  const packLimit = isDynamicPack ? (product?.packSize || 0) : selectedPackUnits;
  const flavorValues = Object.values(flavorSelections) as number[];
  const totalFlavorsSelected: number = flavorValues.reduce((sum, qty) => sum + qty, 0);
  const remainingUnits = packLimit - totalFlavorsSelected;
  
  // Preço calculado com base na seleção
  const totalPackPrice = currentPrice;
  const pricePerUnit = totalPackPrice / packLimit;
  
  // Verificar se pode fazer entrega (mínimo 50 unidades para delivery, ou sempre para packs dinâmicos se permitido)
  const canDelivery = isDynamicPack ? true : (selectedPackUnits >= 50);
  
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
      // Para Pack Salgados ou Pack Dinâmico
      if (isAnyPack) {
        // Verificar se os sabores foram selecionados corretamente
        if (totalFlavorsSelected !== packLimit) {
          alert(`Por favor, selecione exatamente ${packLimit} unidades de sabores. Faltam ${remainingUnits} unidades.`);
          return;
        }
        
        // Verificar se pode fazer entrega
        if (deliveryType === 'delivery' && !canDelivery) {
          alert(`Para entrega ao domicílio, o mínimo é de 50 unidades.`);
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
        
        const deliveryLabel = deliveryType === 'delivery' ? 'Entrega' : 'Levantamento';
        const typeLabel = isDynamicPack ? '' : (selectedPackType === 'fritos' ? 'Fritos' : 'Congelados');
        
        const packProduct = {
          ...product,
          id: `${product.id}-${Date.now()}`,
          name: `${product.name}${isDynamicPack ? '' : ` ${selectedPackUnits}un. (${typeLabel})`} - ${deliveryLabel}`,
          description: `Sabores: ${flavorsDescription}`,
          price: totalPackPrice
        };
        addToCart(packProduct);
        
        // Limpar seleções após adicionar
        setFlavorSelections({});
        setCurrentStep(1);
      } else if (isProntoParaComer) {
        const doseLabel = selectedDose === 'full' ? '1 Dose' : '1/2 Dose';
        const stateLabel = selectedState === 'ready' ? 'Pronto a Comer' : 'Congelado';
        
        const hasDoses = product.hasDoses || product.category === 'Pronto para Comer';
        const allowState = product.allowStateSelection || product.category === 'Pronto para Comer';
        
        let customName = product.name;
        if (hasDoses) customName += ` (${doseLabel})`;
        if (allowState) customName += ` - ${stateLabel}`;

        const prontoProduct = {
          ...product,
          id: `${product.id}-${hasDoses ? selectedDose : 'none'}-${allowState ? selectedState : 'none'}`,
          name: customName,
          price: currentPrice
        };
        addToCart(prontoProduct, quantity);
      } else {
        addToCart(product, quantity);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleProductAction = () => {
    if (product?.category === 'Especiais') {
      setQuoteModal({ isOpen: true, product });
    } else if (isAnyPack && currentStep === 1) {
      // Se for pack dinâmico e só tem sabores para escolher, pula direto se não houver etapa 1
      if (isDynamicPack) {
        setCurrentStep(2);
      } else {
        setCurrentStep(2);
      }
      // Scroll suave para a seleção de sabores
      const flavorSection = document.getElementById('flavor-selection');
      if (flavorSection) flavorSection.scrollIntoView({ behavior: 'smooth' });
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
                  <>€{currentPrice.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-xs font-normal opacity-80">/Kg</span>}</>
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
                  <>€{currentPrice.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-sm font-normal opacity-80">/Kg</span>}</>
                )}
              </span>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Sobre este Produto</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
            
            {/* Pack Salgados - Sistema de Seleção Simplificado (50/100 un) */}
            {product.category === 'Bolos de Aniversário' && (
              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                <p className="text-gold-800 text-sm">
                  <strong>Nota:</strong> O preço indicado é por quilograma. Encomendas personalizadas disponíveis mediante orçamento.
                </p>
              </div>
            )}
            
            {product.category === 'Especiais' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="text-purple-800 text-sm">
                  <strong>Produto Especial:</strong> Este produto é personalizado de acordo com as suas preferências. Contacte-nos para um orçamento à medida.
            
            {/* Opções de Dose e Estado para Pronto para Comer */}
            {isProntoParaComer && !isPackSalgados && (
              <div className="space-y-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                {(product.hasDoses || product.category === 'Pronto para Comer') && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Escolha a Dose</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedDose('full')}
                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                          selectedDose === 'full' 
                            ? 'border-gold-500 bg-gold-50 text-gold-700' 
                            : 'border-white bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        1 Dose
                      </button>
                      <button
                        onClick={() => setSelectedDose('half')}
                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                          selectedDose === 'half' 
                            ? 'border-gold-500 bg-gold-50 text-gold-700' 
                            : 'border-white bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        Meia Dose
                      </button>
                    </div>
                  </div>
                )}

                {(product.allowStateSelection || product.category === 'Pronto para Comer') && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Como deseja receber?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedState('ready')}
                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                          selectedState === 'ready' 
                            ? 'border-gold-500 bg-gold-50 text-gold-700' 
                            : 'border-white bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        Pronto a Comer
                      </button>
                      <button
                        onClick={() => setSelectedState('frozen')}
                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                          selectedState === 'frozen' 
                            ? 'border-gold-500 bg-gold-50 text-gold-700' 
                            : 'border-white bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        Congelado
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Preço da seleção:</span>
                  <span className="text-xl font-bold text-gold-700">€{currentPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
            
            {/* Pack Salgados e Packs Dinâmicos */}
            {isAnyPack && (
              <div className="space-y-8 animate-fade-in mb-8">
                {/* Indicador de Passo - Só mostra se não for dinâmico */}
                {!isDynamicPack && (
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                      <div className={`h-1 flex-1 rounded-full transition-colors ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    </div>
                  </div>
                )}

                {(currentStep === 1 && !isDynamicPack) ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">1. Escolha a Quantidade</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[50, 100].map((units) => (
                          <button
                            key={units}
                            onClick={() => {
                              setSelectedPackUnits(units as 50 | 100);
                              setFlavorSelections({}); 
                            }}
                            className={`p-4 rounded-2xl border-2 transition-all text-center ${
                              selectedPackUnits === units 
                                ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' 
                                : 'border-gray-100 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-2xl font-bold text-gray-900">{units}</span>
                            <span className="text-sm text-gray-500 uppercase tracking-tighter">Salgados</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">2. Escolha o Tipo</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {(['fritos', 'congelados'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedPackType(type);
                              setFlavorSelections({});
                            }}
                            className={`p-4 rounded-2xl border-2 transition-all text-center ${
                              selectedPackType === type 
                                ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' 
                                : 'border-gray-100 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-lg font-bold capitalize text-gray-900">
                              {type === 'fritos' ? 'Fritos' : 'Congelados'}
                            </span>
                            <span className="text-sm font-bold text-orange-600">
                              €{predefinedPacks[selectedPackUnits as 50 | 100][type].price.toFixed(2)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">Pack Selecionado:</span>
                        <span className="font-bold text-gray-900 capitalize text-sm">{selectedPackUnits} Salgados {selectedPackType}</span>
                      </div>
                      <div className="flex justify-between items-center text-xl">
                        <span className="text-gray-900 font-bold">Preço Total:</span>
                        <span className="font-black text-orange-600">€{totalPackPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                      escolha os tipos de salgados no seu pack
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6" id="flavor-selection">
                    <div className="flex items-center justify-between">
                      {!isDynamicPack && (
                        <button 
                          onClick={() => setCurrentStep(1)}
                          className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium"
                        >
                          <ArrowLeft size={16} /> Voltar
                        </button>
                      )}
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                        {isDynamicPack ? `Escolha os seus ${packLimit} itens` : 'Selecione os sabores'}
                      </h3>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${remainingUnits === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {remainingUnits === 0 ? '✓ Completo' : `Faltam ${remainingUnits} un.`}
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border border-gray-100 rounded-xl p-2">
                      {availableFlavors.map((flavor) => {
                        const currentQty = flavorSelections[flavor.id] || 0;
                        return (
                          <div key={flavor.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${currentQty > 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-100 bg-white'}`}>
                            <img src={flavor.image} alt={flavor.name} className="w-14 h-14 rounded-lg object-cover" onError={handleImageError} />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-sm truncate">{flavor.name}</p>
                              <p className="text-xs text-gray-500">Unidades: {currentQty}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => currentQty > 0 && setFlavorSelections(prev => ({ ...prev, [flavor.id]: currentQty - 1 }))}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentQty > 0 ? 'bg-white text-gray-900 border border-gray-200' : 'bg-gray-50 text-gray-300'}`}
                              >
                                −
                              </button>
                              <span className="font-bold w-4 text-center">{currentQty}</span>
                              <button
                                onClick={() => totalFlavorsSelected < packLimit && setFlavorSelections(prev => ({ ...prev, [flavor.id]: currentQty + 1 }))}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${totalFlavorsSelected < packLimit ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-300'}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex justify-between items-center text-xl">
                        <span className="text-gray-900 font-bold">Preço do Pack:</span>
                        <span className="font-black text-orange-600">€{totalPackPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {remainingUnits === 0 && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                        <p className="text-green-700 text-sm font-bold text-center">Pack Completo! Já pode adicionar ao carrinho.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tipo de Entrega para Pack */}
                {(isDynamicPack || selectedPackUnits >= 50) && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Como deseja receber?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-4 rounded-xl font-medium transition-all border-2 flex flex-col items-center gap-2 ${
                          deliveryType === 'pickup'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Store size={24} />
                        <span className="font-bold">Levantar na Loja</span>
                      </button>
                      <button
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-4 rounded-xl font-medium transition-all border-2 flex flex-col items-center gap-2 ${
                          deliveryType === 'delivery'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-lg'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Truck size={24} />
                        <span className="font-bold">Entrega</span>
                      </button>
                    </div>
                  </div>
                )}
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
            
            {/* Banner de Encomendas Pausadas */}
            {!orderingEnabled && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 text-sm">Encomendas Temporariamente Indisponíveis</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {siteConfig.businessSettings?.notAcceptingMessage || 'De momento não estamos a aceitar encomendas. Voltaremos em breve!'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Action Buttons - Seção Destacada para Conversão */}
            <div className="space-y-4 mb-6">
              {/* CTA Principal com Destaque Visual */}
              {orderingEnabled ? (
                <button
                  onClick={handleProductAction}
                  className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl ${
                    addedToCart
                      ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                      : isPackSalgados && currentStep === 1
                      ? 'bg-gradient-to-r from-gray-800 to-black text-white hover:from-black hover:to-gray-900'
                      : product.category === 'Especiais'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-700 text-white hover:from-gold-600 hover:to-gold-800'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <span className="text-2xl animate-bounce">✓</span>
                      Adicionado!
                    </>
                  ) : product.category === 'Especiais' ? (
                    <>
                      <MessageCircle size={24} />
                      Pedir Orçamento
                    </>
                  ) : isPackSalgados && currentStep === 1 ? (
                    <>
                      <ChevronRight size={24} />
                      Escolher Sabores
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      {isPackSalgados ? 'Finalizar Pack e Adicionar' : 'Adicionar ao Carrinho'}
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed shadow-md">
                  <AlertCircle size={24} />
                  Encomendas Indisponíveis
                </div>
              )}
              
              {/* Botão de Compartilhar */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all text-sm"
                title="Partilhar"
              >
                <Share2 size={16} />
                Partilhar este Produto
              </button>
            </div>
            
            {/* Sugestão de Pack Salgados para produtos da categoria Salgados */}
            {product.category === 'Salgados' && (() => {
              const packSalgados = products.find(p => p.category === 'Pack Salgados');
              if (!packSalgados) return null;
              
              const unitPriceIndividual = product.price;
              const unitPricePack100 = 0.38; // Preço por unidade no pack de 100 fritos
              const savingsPerUnit = unitPriceIndividual - unitPricePack100;
              const savingsPer100 = savingsPerUnit * 100;
              
              return (
                <Link 
                  to={`/produto/${packSalgados.id}`}
                  className="block mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img 
                        src={packSalgados.image} 
                        alt="Pack Salgados"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-900 font-bold text-sm uppercase tracking-wide">Opção Económica</span>
                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POUPANÇA</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Com o <strong>Pack de Salgados</strong> o preço por unidade é reduzido substancialmente.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-700">
                        <span className="px-2 py-1 bg-white border border-gray-200 rounded">50 un: €20 (€0.40/un)</span>
                        <span className="px-2 py-1 bg-gray-800 text-white rounded">100 un: €38 (€0.38/un)</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-3">
                        Poupe até <strong>€{savingsPer100.toFixed(2)}</strong> ao encomendar em pack.
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

        {/* Depoimentos de Clientes */}
        {testimonials.length > 0 && (
          <div className="border-t border-gray-100 pt-16 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                O que os Clientes Dizem
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Confira as avaliações de quem já experimentou os nossos produtos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-gradient-to-br from-gold-50 to-cream-50 border border-gold-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-gold-500 text-sm">★</span>
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-gray-300 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic mb-3">
                    "{testimonial.text}"
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-gray-500">
                      {testimonial.product}
                    </p>
                    <p className="text-xs text-gold-600 font-medium">
                      {testimonial.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção CTA antes de Recomendações */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-2 border-orange-200 rounded-2xl p-8 mb-20 text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-3">
            Pronto para Encomendar?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Garanta a sua encomenda agora mesmo! Produtos frescos, qualidade garantida, entrega rápida.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 320, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-orange-600 text-white font-bold rounded-xl hover:from-gold-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-2xl"
          >
            <ShoppingCart size={20} />
            Ir para a Compra
          </button>
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
