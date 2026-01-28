import React, { useState, useMemo, useRef } from 'react';
import { useShop } from '../context';
import { 
  Package, LogOut, Plus, Edit2, Trash2, X, Save, 
  DollarSign, Image, Layout, Phone, Check, Search,
  BarChart3, ShoppingBag, TrendingUp, Eye, EyeOff,
  Grid3X3, List, ChevronDown, Upload, RefreshCw,
  AlertCircle, CheckCircle, Clock, Users, Cake,
  Star, MessageSquare, ThumbsUp, ThumbsDown,
  Truck, Store, MapPin, Calendar, Filter, ChevronRight,
  Play, Printer, FileText, ImagePlus, Link, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, SiteConfig, Order, Testimonial, OrderStatus, BlogPost } from '../types';

// Componente de Upload de Imagem
interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Imagem", required = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>(value && !value.startsWith('data:') ? 'url' : 'upload');
  const [isLoading, setIsLoading] = useState(false);

  // Função para comprimir imagem
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar se necessário
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível criar contexto do canvas'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para Base64 com compressão
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tamanho (máx 5MB antes da compressão)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB. Por favor, escolha uma imagem menor.');
        return;
      }

      setIsLoading(true);
      try {
        // Comprimir imagem para reduzir tamanho
        const compressedImage = await compressImage(file, 1200, 0.75);
        
        // Verificar se após compressão ainda é muito grande
        if (compressedImage.length > 1000000) {
          // Tentar comprimir mais
          const moreCompressed = await compressImage(file, 800, 0.6);
          onChange(moreCompressed);
        } else {
          onChange(compressedImage);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro ao processar a imagem. Tente novamente com outra imagem.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label} {required && '*'}</label>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setUploadMode('upload')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              uploadMode === 'upload' 
                ? 'bg-white text-gold-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImagePlus size={14} />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              uploadMode === 'url' 
                ? 'bg-white text-gold-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link size={14} />
            URL
          </button>
        </div>
      </div>

      {uploadMode === 'upload' ? (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isLoading 
                ? 'border-gold-400 bg-gold-50' 
                : 'border-gray-200 hover:border-gold-400 hover:bg-gold-50'
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw size={32} className="text-gold-500 animate-spin" />
                <span className="text-sm text-gray-600">A carregar imagem...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm text-gray-600">Clique para selecionar uma imagem</span>
                <span className="text-xs text-gray-400">JPG, PNG ou GIF (máx. 2MB)</span>
              </div>
            )}
          </div>
          
          {value && (
            <div className="relative">
              <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Erro';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={14} />
              </button>
              <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded-lg">
                ✓ Imagem carregada
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="url" 
              required={required && !value}
              placeholder="https://exemplo.com/imagem.jpg"
              value={value.startsWith('data:') ? '' : value}
              onChange={e => onChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 pl-9 font-mono text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            />
          </div>
          <p className="text-xs text-gray-500">
            💡 Dica: Use sites como Unsplash ou Imgur para hospedar imagens gratuitamente.
          </p>
          {value && !value.startsWith('data:') && (
            <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100">
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=URL+Inválida';
                }}
              />
              <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">Preview</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Categorias disponíveis - agora vem do contexto

const Admin: React.FC = () => {
  const { 
    user, logout, orders, products, 
    addProduct, updateProduct, deleteProduct, 
    siteConfig, updateSiteConfig,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    updateOrder, deleteOrder,
    categories, addCategory, updateCategory, deleteCategory
  } = useShop();
  const navigate = useNavigate();

  // Tab States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'testimonials' | 'blog' | 'site'>('dashboard');
  
  // Product States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const emptyProduct: Product = { 
    id: '', 
    name: '', 
    description: '', 
    price: 0, 
    image: '', 
    category: categories[0] || 'Salgados',
    hasDoses: false,
    priceFullDose: 0,
    priceHalfDose: 0,
    allowStateSelection: false,
    priceReady: 0,
    priceFrozen: 0,
    priceFullDoseReady: 0,
    priceHalfDoseReady: 0,
    priceFullDoseFrozen: 0,
    priceHalfDoseFrozen: 0
  };
  const [productForm, setProductForm] = useState<Product>(emptyProduct);
  const [productSavedSuccess, setProductSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Category States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState<string | null>(null);

  // Site Editor State
  const [siteForm, setSiteForm] = useState<SiteConfig>(siteConfig);
  const [siteSaved, setSiteSaved] = useState(false);

  // Testimonial States
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const emptyTestimonial: Testimonial = { 
    id: '', name: '', avatar: '', rating: 5, text: '', date: '', product: '', isApproved: false 
  };
  const [testimonialForm, setTestimonialForm] = useState<Testimonial>(emptyTestimonial);
  const [testimonialSavedSuccess, setTestimonialSavedSuccess] = useState(false);
  const [showDeleteTestimonialConfirm, setShowDeleteTestimonialConfirm] = useState<string | null>(null);

  // Blog States
  const [isEditingBlogPost, setIsEditingBlogPost] = useState(false);
  const emptyBlogPost: BlogPost = { 
    id: '', title: '', excerpt: '', date: '', image: '', content: '' 
  };
  const [blogPostForm, setBlogPostForm] = useState<BlogPost>(emptyBlogPost);
  const [blogPostSavedSuccess, setBlogPostSavedSuccess] = useState(false);
  const [showDeleteBlogPostConfirm, setShowDeleteBlogPostConfirm] = useState<string | null>(null);

  // Order States
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderDeliveryFilter, setOrderDeliveryFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDeleteOrderConfirm, setShowDeleteOrderConfirm] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalStories = blogPosts.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
    const categoryCounts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalProducts, totalOrders, totalStories, totalRevenue, pendingOrders, categoryCounts };
  }, [products, orders, blogPosts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                           o.items.some(item => item.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchesDelivery = orderDeliveryFilter === 'all' || o.deliveryType === orderDeliveryFilter;
      return matchesSearch && matchesStatus && matchesDelivery;
    });
  }, [orders, orderSearchQuery, orderStatusFilter, orderDeliveryFilter]);

  // Order Statistics
  const orderStats = useMemo(() => {
    const pending = orders.filter(o => o.status === 'Pendente').length;
    const inProduction = orders.filter(o => o.status === 'Em Produção').length;
    const delivered = orders.filter(o => o.status === 'Entregue').length;
    const todayOrders = orders.filter(o => {
      const today = new Date().toLocaleDateString('pt-PT');
      return o.deliveryDate === today;
    }).length;
    const deliveries = orders.filter(o => o.deliveryType === 'delivery').length;
    const pickups = orders.filter(o => o.deliveryType === 'pickup').length;
    return { pending, inProduction, delivered, todayOrders, deliveries, pickups };
  }, [orders]);

  // Handlers
  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/100x100/F0EAD6/944D46?text=Sem+Img';
  };

  const handleEditProductClick = (product: Product) => {
    setProductForm({ ...product });
    setProductSavedSuccess(false);
    setIsEditingProduct(true);
  };

  const handleNewProductClick = () => {
    setProductForm({ ...emptyProduct, id: Date.now().toString() });
    setProductSavedSuccess(false);
    setIsEditingProduct(true);
  };

  const handleDeleteProductClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        await deleteProduct(showDeleteConfirm);
        setShowDeleteConfirm(null);
      } catch (error) {
        console.error('Erro ao eliminar produto:', error);
        alert('Erro ao eliminar produto. Verifique a conexão.');
      }
    }
  };

  const handleProductSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: nome obrigatório, preço > 0 (exceto para categoria "Especiais")
    const isEspeciais = productForm.category === 'Especiais';
    if (!productForm.name) {
      alert("Por favor preencha o nome do produto.");
      return;
    }
    if (!isEspeciais && productForm.price <= 0) {
      alert("Por favor preencha um preço válido.");
      return;
    }
    
    const cleanedProduct = {
      ...productForm,
      image: productForm.image.trim(),
      price: isEspeciais ? 0 : productForm.price // Especiais sempre têm preço 0
    };

    try {
      if (products.some(p => p.id === cleanedProduct.id)) {
        await updateProduct(cleanedProduct);
      } else {
        await addProduct(cleanedProduct);
      }
      
      setProductSavedSuccess(true);
      setTimeout(() => {
        setIsEditingProduct(false);
        setProductSavedSuccess(false);
      }, 600);
    } catch (error) {
      console.error('Erro ao guardar produto:', error);
      alert('Erro ao guardar produto. Verifique as permissões do Firebase.');
    }
  };

  const handleSiteConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verificar se a imagem Base64 não é muito grande (máx ~1MB para Firestore)
      const promoBannerImage = siteForm.promoBanner.image;
      if (promoBannerImage && promoBannerImage.startsWith('data:') && promoBannerImage.length > 1000000) {
        alert('A imagem do banner é muito grande. Por favor, use uma imagem menor (máx. 700KB) ou forneça uma URL externa.');
        return;
      }
      const heroImage = siteForm.hero.image;
      if (heroImage && heroImage.startsWith('data:') && heroImage.length > 1000000) {
        alert('A imagem do hero é muito grande. Por favor, use uma imagem menor (máx. 700KB) ou forneça uma URL externa.');
        return;
      }
      
      await updateSiteConfig(siteForm);
      setSiteSaved(true);
      setTimeout(() => setSiteSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao guardar configurações:', error);
      alert('Erro ao guardar as alterações. Verifique as permissões do Firebase ou use imagens menores/URLs externas.');
    }
  };

  // Testimonial Handlers
  const handleEditTestimonialClick = (testimonial: Testimonial) => {
    setTestimonialForm({ ...testimonial });
    setTestimonialSavedSuccess(false);
    setIsEditingTestimonial(true);
  };

  const handleNewTestimonialClick = () => {
    setTestimonialForm({ 
      ...emptyTestimonial, 
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setTestimonialSavedSuccess(false);
    setIsEditingTestimonial(true);
  };

  const handleDeleteTestimonialClick = (id: string) => {
    setShowDeleteTestimonialConfirm(id);
  };

  const confirmDeleteTestimonial = async () => {
    if (showDeleteTestimonialConfirm) {
      try {
        await deleteTestimonial(showDeleteTestimonialConfirm);
        setShowDeleteTestimonialConfirm(null);
      } catch (error) {
        console.error('Erro ao eliminar avaliação:', error);
        alert('Erro ao eliminar avaliação.');
      }
    }
  };

  const handleTestimonialSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testimonialForm.name || !testimonialForm.text) {
      alert("Por favor preencha o nome e o texto da avaliação.");
      return;
    }

    // Generate avatar if empty
    const finalTestimonial = {
      ...testimonialForm,
      avatar: testimonialForm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonialForm.name)}&background=D4AF37&color=fff`
    };

    try {
      if (testimonials.some(t => t.id === finalTestimonial.id)) {
        await updateTestimonial(finalTestimonial);
      } else {
        await addTestimonial(finalTestimonial);
      }
      
      setTestimonialSavedSuccess(true);
      setTimeout(() => {
        setIsEditingTestimonial(false);
        setTestimonialSavedSuccess(false);
      }, 600);
    } catch (error) {
      console.error('Erro ao guardar avaliação:', error);
      alert('Erro ao guardar avaliação.');
    }
  };

  const toggleTestimonialApproval = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial({ ...testimonial, isApproved: !testimonial.isApproved });
    } catch (error) {
      console.error('Erro ao atualizar aprovação:', error);
    }
  };

  // Blog Post Handlers
  const handleEditBlogPostClick = (post: BlogPost) => {
    setBlogPostForm({ ...post });
    setBlogPostSavedSuccess(false);
    setIsEditingBlogPost(true);
  };

  const handleNewBlogPostClick = () => {
    setBlogPostForm({ 
      ...emptyBlogPost, 
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setBlogPostSavedSuccess(false);
    setIsEditingBlogPost(true);
  };

  const handleDeleteBlogPostClick = (id: string) => {
    setShowDeleteBlogPostConfirm(id);
  };

  const confirmDeleteBlogPost = async () => {
    if (showDeleteBlogPostConfirm) {
      try {
        await deleteBlogPost(showDeleteBlogPostConfirm);
        setShowDeleteBlogPostConfirm(null);
      } catch (error) {
        console.error('Erro ao eliminar história:', error);
        alert('Erro ao eliminar história.');
      }
    }
  };

  const handleBlogPostSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blogPostForm.title || !blogPostForm.excerpt) {
      alert("Por favor preencha o título e o resumo da história.");
      return;
    }

    try {
      if (blogPosts.some(p => p.id === blogPostForm.id)) {
        await updateBlogPost(blogPostForm);
      } else {
        await addBlogPost(blogPostForm);
      }
      
      setBlogPostSavedSuccess(true);
      setTimeout(() => {
        setIsEditingBlogPost(false);
        setBlogPostSavedSuccess(false);
      }, 600);
    } catch (error) {
      console.error('Erro ao guardar história:', error);
      alert('Erro ao guardar história.');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pendente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Em Produção': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Entregue': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pendente': return <Clock size={14} />;
      case 'Em Produção': return <RefreshCw size={14} className="animate-spin" />;
      case 'Entregue': return <CheckCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  // Redirect if not admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h1>
          <p className="text-gray-600 mb-4">Área reservada a administradores.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-40 hidden lg:block">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-serif font-bold text-gold-400">ROSITA</h1>
          <p className="text-xs text-gray-400 mt-1">Painel Administrativo</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'products' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Cake size={20} />
            <span className="font-medium">Produtos</span>
            <span className="ml-auto bg-gray-700 text-xs px-2 py-1 rounded">{products.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'categories' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Grid3X3 size={20} />
            <span className="font-medium">Categorias</span>
            <span className="ml-auto bg-gray-700 text-xs px-2 py-1 rounded">{categories.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'orders' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <ShoppingBag size={20} />
            <span className="font-medium">Encomendas</span>
            {stats.pendingOrders > 0 && (
              <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">{stats.pendingOrders}</span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'testimonials' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Avaliações</span>
            <span className="ml-auto bg-gray-700 text-xs px-2 py-1 rounded">{testimonials.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'blog' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Histórias</span>
            <span className="ml-auto bg-gray-700 text-xs px-2 py-1 rounded">{blogPosts.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('site')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'site' 
                ? 'bg-gold-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Layout size={20} />
            <span className="font-medium">Configurar Site</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-serif font-bold text-gold-400">ROSITA Admin</h1>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="text-gray-400 hover:text-red-400"
          >
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {(['dashboard', 'products', 'categories', 'orders', 'testimonials', 'blog', 'site'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-gold-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {tab === 'dashboard' && 'Dashboard'}
              {tab === 'products' && 'Produtos'}
              {tab === 'categories' && 'Categorias'}
              {tab === 'orders' && 'Encomendas'}
              {tab === 'testimonials' && 'Avaliações'}
              {tab === 'blog' && 'Histórias'}
              {tab === 'site' && 'Site'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-28 lg:pt-0">
        <div className="p-6 lg:p-8">
          
          {/* === DASHBOARD === */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Visão geral da sua pastelaria</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Cake size={24} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Ativo</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                  <p className="text-sm text-gray-500 mt-1">Produtos na Vitrine</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag size={24} className="text-amber-600" />
                    </div>
                    {stats.pendingOrders > 0 && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {stats.pendingOrders} pendentes
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-sm text-gray-500 mt-1">Total de Encomendas</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={24} className="text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-1">Receita Total</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStories}</p>
                  <p className="text-sm text-gray-500 mt-1">Histórias Publicadas</p>
                </div>
              </div>

              {/* Categories Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Produtos por Categoria</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.categoryCounts).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{category}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-gold-500 h-2 rounded-full transition-all"
                              style={{ width: `${((count as number) / stats.totalProducts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Últimas Encomendas</h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhuma encomenda ainda.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-800">#{order.id}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Ações Rápidas</h3>
                <p className="text-gold-100 text-sm mb-4">O que deseja fazer agora?</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => { setActiveTab('products'); handleNewProductClick(); }}
                    className="flex items-center gap-2 bg-white text-gold-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gold-50 transition-colors"
                  >
                    <Plus size={18} /> Novo Produto
                  </button>
                  <button 
                    onClick={() => { setActiveTab('blog'); handleNewBlogPostClick(); }}
                    className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                  >
                    <BookOpen size={18} /> Nova História
                  </button>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                  >
                    <ShoppingBag size={18} /> Ver Encomendas
                  </button>
                  <button 
                    onClick={() => window.open('/', '_blank')}
                    className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                  >
                    <Eye size={18} /> Ver Loja
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === PRODUCTS === */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Gestão de Produtos</h1>
                  <p className="text-gray-500">Adicione, edite ou remova produtos da vitrine</p>
                </div>
                <button 
                  onClick={handleNewProductClick}
                  className="flex items-center gap-2 bg-gold-600 text-white px-5 py-2.5 rounded-lg hover:bg-gold-700 transition-colors font-medium shadow-lg shadow-gold-200"
                >
                  <Plus size={20} /> Novo Produto
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar produtos..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-gold-400 outline-none cursor-pointer"
                      >
                        <option value="all">Todas Categorias</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                      >
                        <List size={18} className={viewMode === 'list' ? 'text-gold-600' : 'text-gray-400'} />
                      </button>
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                      >
                        <Grid3X3 size={18} className={viewMode === 'grid' ? 'text-gold-600' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products List/Grid */}
              {viewMode === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
                          <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                          <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                          <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  onError={handleThumbnailError}
                                  className="w-14 h-14 rounded-lg object-cover bg-gray-100 shadow-sm" 
                                />
                                <div>
                                  <p className="font-semibold text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">{product.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-gray-900">
                                €{product.price.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-xs text-gray-500 font-normal">/Kg</span>}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEditProductClick(product)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProductClick(product.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="p-12 text-center">
                      <Package size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum produto encontrado.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          onError={handleThumbnailError}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditProductClick(product)}
                            className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProductClick(product.id)}
                            className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                        <p className="text-lg font-bold text-gold-600">
                          €{product.price.toFixed(2)}{product.category === 'Bolos de Aniversário' && <span className="text-sm text-gray-500 font-normal">/Kg</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === CATEGORIES === */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Gestão de Categorias</h1>
                  <p className="text-gray-500">Criar, editar e eliminar categorias de produtos</p>
                </div>
              </div>

              {/* Add New Category */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={20} className="text-gold-600" />
                  Adicionar Nova Categoria
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Nome da categoria..."
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        addCategory(newCategoryName.trim());
                        setNewCategoryName('');
                      }
                    }}
                    disabled={!newCategoryName.trim()}
                    className="px-6 py-3 bg-gold-600 text-white rounded-lg font-bold hover:bg-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-bold text-gray-800">
                    Categorias Existentes ({categories.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {categories.map((category, index) => {
                    const productCount = products.filter(p => p.category === category).length;
                    const isSpecial = category === 'Especiais';
                    const isCakes = category === 'Bolos de Aniversário';
                    
                    return (
                      <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        {editingCategory === category ? (
                          <div className="flex-1 flex items-center gap-3">
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={e => setEditCategoryName(e.target.value)}
                              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-400 outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editCategoryName.trim()) {
                                  updateCategory(category, editCategoryName.trim());
                                  setEditingCategory(null);
                                  setEditCategoryName('');
                                }
                              }}
                              className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategory(null);
                                setEditCategoryName('');
                              }}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                                <Grid3X3 size={20} className="text-gold-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{category}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">{productCount} produto{productCount !== 1 ? 's' : ''}</span>
                                  {isSpecial && (
                                    <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full">Sob Orçamento</span>
                                  )}
                                  {isCakes && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Preço por Kg</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingCategory(category);
                                  setEditCategoryName(category);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              {showDeleteCategoryConfirm === category ? (
                                <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg">
                                  <span className="text-xs text-red-600">
                                    {productCount > 0 ? `${productCount} produto(s) serão afetados!` : 'Eliminar?'}
                                  </span>
                                  <button
                                    onClick={() => {
                                      deleteCategory(category);
                                      setShowDeleteCategoryConfirm(null);
                                    }}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteCategoryConfirm(null)}
                                    className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setShowDeleteCategoryConfirm(category)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {categories.length === 0 && (
                  <div className="p-12 text-center">
                    <Grid3X3 size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma categoria criada ainda.</p>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Informações Importantes
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• A categoria <strong>"Especiais"</strong> mostra "Sob Orçamento" em vez de preço</li>
                  <li>• A categoria <strong>"Bolos de Aniversário"</strong> mostra o preço por Kg</li>
                  <li>• Ao editar o nome de uma categoria, os produtos são atualizados automaticamente</li>
                  <li>• Ao eliminar uma categoria, os produtos dessa categoria perdem a classificação</li>
                </ul>
              </div>
            </div>
          )}

          {/* === ORDERS === */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Gestão de Encomendas</h1>
                  <p className="text-gray-500">Gerir, acompanhar e atualizar estado das encomendas</p>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
                      <p className="text-xs text-gray-500">Pendentes</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.inProduction}</p>
                      <p className="text-xs text-gray-500">Em Produção</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                      <p className="text-xs text-gray-500">Entregues</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.todayOrders}</p>
                      <p className="text-xs text-gray-500">Para Hoje</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Truck size={20} className="text-rose-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.deliveries}</p>
                      <p className="text-xs text-gray-500">Entregas</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Store size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.pickups}</p>
                      <p className="text-xs text-gray-500">Levantamentos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar por ID ou produto..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value as 'all' | OrderStatus)}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">Todos os Estados</option>
                      <option value="Pendente">🟡 Pendente</option>
                      <option value="Em Produção">🔵 Em Produção</option>
                      <option value="Entregue">🟢 Entregue</option>
                    </select>
                    <select
                      value={orderDeliveryFilter}
                      onChange={(e) => setOrderDeliveryFilter(e.target.value as 'all' | 'delivery' | 'pickup')}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">Todos os Tipos</option>
                      <option value="delivery">🚚 Entrega</option>
                      <option value="pickup">🏪 Levantamento</option>
                    </select>
                  </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                  <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ainda não há encomendas registadas.</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                  <Filter size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma encomenda corresponde aos filtros.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Order Header */}
                      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="font-bold text-lg text-gray-900">#{order.id}</span>
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                                order.deliveryType === 'delivery' 
                                  ? 'bg-rose-100 text-rose-700' 
                                  : 'bg-cyan-100 text-cyan-700'
                              }`}>
                                {order.deliveryType === 'delivery' ? <Truck size={12} /> : <Store size={12} />}
                                {order.deliveryType === 'delivery' ? 'Entrega' : 'Levantamento'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span>📅 Pedido: {order.date}</span>
                              <span>🗓️ Entrega: {order.deliveryDate} às {order.deliveryTime}</span>
                              <span>💳 {order.paymentMethod}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gold-600">€{order.total.toFixed(2)}</p>
                            {order.deliveryFee && order.deliveryFee > 0 && (
                              <p className="text-xs text-gray-500">inclui €{order.deliveryFee.toFixed(2)} de entrega</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Actions - Status Update */}
                      <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600">Atualizar Estado:</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateOrder({ ...order, status: 'Pendente' })}
                            disabled={order.status === 'Pendente'}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                              order.status === 'Pendente'
                                ? 'bg-amber-100 text-amber-700 cursor-default'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                            }`}
                          >
                            <Clock size={14} /> Pendente
                          </button>
                          <button
                            onClick={() => updateOrder({ ...order, status: 'Em Produção' })}
                            disabled={order.status === 'Em Produção'}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                              order.status === 'Em Produção'
                                ? 'bg-blue-100 text-blue-700 cursor-default'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <Play size={14} /> Em Produção
                          </button>
                          <button
                            onClick={() => updateOrder({ ...order, status: 'Entregue' })}
                            disabled={order.status === 'Entregue'}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                              order.status === 'Entregue'
                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'
                            }`}
                          >
                            <CheckCircle size={14} /> Entregue
                          </button>
                        </div>
                      </div>
                      
                      {/* Delivery Info */}
                      {order.deliveryType === 'delivery' && order.deliveryAddress && (
                        <div className="px-4 sm:px-6 py-3 bg-rose-50/50 border-b border-gray-100">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-700">Morada de Entrega:</span>
                              <span className="text-gray-600 ml-2">{order.deliveryAddress}</span>
                              {order.deliveryDistance && (
                                <span className="text-gray-400 ml-2">({order.deliveryDistance}km)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* NIF Info */}
                      {order.nif && (
                        <div className="px-4 sm:px-6 py-3 bg-blue-50/50 border-b border-gray-100">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-blue-500 font-bold text-xs">NIF</span>
                            <div>
                              <span className="font-medium text-gray-700">Fatura com Contribuinte:</span>
                              <span className="text-gray-800 ml-2 font-mono font-bold">{order.nif}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Order Items */}
                      <div className="p-4 sm:p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Itens do Pedido</h4>
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
                              <th className="text-left pb-3">Item</th>
                              <th className="text-center pb-3">Qtd</th>
                              <th className="text-right pb-3">Preço Un.</th>
                              <th className="text-right pb-3">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-3 text-gray-800 font-medium">{item.name}</td>
                                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                <td className="py-3 text-right text-gray-500">€{item.price.toFixed(2)}</td>
                                <td className="py-3 text-right font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t border-gray-200">
                            {order.subtotal && order.deliveryFee && order.deliveryFee > 0 && (
                              <>
                                <tr>
                                  <td colSpan={3} className="pt-3 text-right text-gray-500">Subtotal Produtos:</td>
                                  <td className="pt-3 text-right text-gray-700">€{order.subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td colSpan={3} className="py-1 text-right text-gray-500">Taxa de Entrega:</td>
                                  <td className="py-1 text-right text-gray-700">€{order.deliveryFee.toFixed(2)}</td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td colSpan={3} className="pt-2 text-right font-bold text-gray-800">Total:</td>
                              <td className="pt-2 text-right font-bold text-xl text-gold-600">€{order.total.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Order Footer Actions */}
                      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
                        <button
                          onClick={() => setShowDeleteOrderConfirm(order.id)}
                          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5"
                        >
                          <Trash2 size={14} /> Eliminar Encomenda
                        </button>
                        <button
                          onClick={() => {
                            const printContent = `
ROSITA PASTELARIA - ENCOMENDA #${order.id}
========================================
Data do Pedido: ${order.date}
Data de Entrega: ${order.deliveryDate} às ${order.deliveryTime}
Tipo: ${order.deliveryType === 'delivery' ? 'Entrega ao Domicílio' : 'Levantamento na Loja'}
${order.deliveryAddress ? `Morada: ${order.deliveryAddress}` : ''}
${order.nif ? `NIF: ${order.nif}` : ''}
Pagamento: ${order.paymentMethod}
Estado: ${order.status}
----------------------------------------
ITENS:
${order.items.map(item => `${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`).join('\n')}
----------------------------------------
${order.subtotal && order.deliveryFee ? `Subtotal: €${order.subtotal.toFixed(2)}\nTaxa Entrega: €${order.deliveryFee.toFixed(2)}\n` : ''}TOTAL: €${order.total.toFixed(2)}
========================================
                            `;
                            const win = window.open('', '', 'width=400,height=600');
                            win?.document.write(`<pre style="font-family: monospace; font-size: 12px;">${printContent}</pre>`);
                            win?.print();
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5"
                        >
                          <Printer size={14} /> Imprimir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delete Order Confirmation Modal */}
              {showDeleteOrderConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle size={24} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Eliminar Encomenda</h3>
                        <p className="text-sm text-gray-500">#{showDeleteOrderConfirm}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Tem a certeza que deseja eliminar esta encomenda? Esta ação não pode ser revertida.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteOrderConfirm(null)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          deleteOrder(showDeleteOrderConfirm);
                          setShowDeleteOrderConfirm(null);
                        }}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === TESTIMONIALS === */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Avaliações de Clientes</h1>
                  <p className="text-gray-500">Gerir feedback e depoimentos dos clientes</p>
                </div>
                <button 
                  onClick={handleNewTestimonialClick}
                  className="flex items-center gap-2 bg-gold-600 text-white px-5 py-2.5 rounded-lg hover:bg-gold-700 transition-colors font-medium shadow-lg shadow-gold-200"
                >
                  <Plus size={20} /> Nova Avaliação
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <ThumbsUp size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{testimonials.filter(t => t.isApproved).length}</p>
                      <p className="text-sm text-gray-500">Aprovadas</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{testimonials.filter(t => !t.isApproved).length}</p>
                      <p className="text-sm text-gray-500">Pendentes</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                      <Star size={20} className="text-gold-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {testimonials.length > 0 
                          ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                          : '0'}
                      </p>
                      <p className="text-sm text-gray-500">Média</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials List */}
              <div className="space-y-4">
                {testimonials.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Ainda não há avaliações registadas.</p>
                  </div>
                ) : (
                  testimonials.map(testimonial => (
                    <div 
                      key={testimonial.id} 
                      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                        testimonial.isApproved ? 'border-gray-100' : 'border-amber-200 bg-amber-50/30'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Avatar & Info */}
                          <div className="flex items-start gap-4 flex-1">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                              onError={handleThumbnailError}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                  testimonial.isApproved 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {testimonial.isApproved ? <CheckCircle size={12} /> : <Clock size={12} />}
                                  {testimonial.isApproved ? 'Aprovada' : 'Pendente'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={14} 
                                      className={i < testimonial.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200'} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">{testimonial.date}</span>
                                {testimonial.product && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    {testimonial.product}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.text}"</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col items-center gap-2 sm:border-l sm:pl-4 border-gray-100">
                            <button 
                              onClick={() => toggleTestimonialApproval(testimonial)}
                              className={`p-2 rounded-lg transition-colors ${
                                testimonial.isApproved 
                                  ? 'text-amber-600 hover:bg-amber-50' 
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={testimonial.isApproved ? 'Desaprovar' : 'Aprovar'}
                            >
                              {testimonial.isApproved ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button 
                              onClick={() => handleEditTestimonialClick(testimonial)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTestimonialClick(testimonial.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* === BLOG/HISTÓRIAS === */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Gestão de Histórias</h1>
                  <p className="text-gray-500">Criar, editar e publicar histórias no blog</p>
                </div>
                <button 
                  onClick={handleNewBlogPostClick}
                  className="flex items-center gap-2 bg-gold-600 text-white px-5 py-2.5 rounded-lg hover:bg-gold-700 transition-colors font-medium shadow-lg shadow-gold-200"
                >
                  <Plus size={20} /> Nova História
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{blogPosts.length}</p>
                      <p className="text-sm text-gray-500">Total de Histórias</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{blogPosts.length}</p>
                      <p className="text-sm text-gray-500">Publicadas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Posts List */}
              <div className="space-y-4">
                {blogPosts.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                    <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Ainda não há histórias publicadas.</p>
                    <button 
                      onClick={handleNewBlogPostClick}
                      className="inline-flex items-center gap-2 bg-gold-600 text-white px-5 py-2.5 rounded-lg hover:bg-gold-700 transition-colors font-medium"
                    >
                      <Plus size={18} /> Criar Primeira História
                    </button>
                  </div>
                ) : (
                  blogPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={handleThumbnailError}
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar size={14} className="text-gold-600" />
                                <span className="text-xs text-gold-600 font-medium">{post.date}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                              <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditBlogPostClick(post)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              {showDeleteBlogPostConfirm === post.id ? (
                                <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                                  <button
                                    onClick={confirmDeleteBlogPost}
                                    className="text-xs text-red-600 font-bold hover:text-red-700"
                                  >
                                    Confirmar
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => setShowDeleteBlogPostConfirm(null)}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleDeleteBlogPostClick(post.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* === SITE EDITOR === */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Configurar Site</h1>
                <p className="text-gray-500">Personalize a aparência da sua loja online</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Hero Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                      <Layout size={18} className="text-gold-600" />
                      Secção Principal (Hero)
                    </h2>
                  </div>
                  <form className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
                      <input 
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        value={siteForm.hero.title}
                        onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, title: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        rows={3}
                        value={siteForm.hero.subtitle}
                        onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, subtitle: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo (URL)</label>
                      <div className="flex gap-3">
                        <input 
                          className="flex-1 border border-gray-200 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.hero.image}
                          onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, image: e.target.value}})}
                        />
                      </div>
                      {siteForm.hero.image && (
                        <div className="mt-3 relative h-32 rounded-lg overflow-hidden bg-gray-100">
                          <img src={siteForm.hero.image} alt="Preview" className="w-full h-full object-cover" onError={handleThumbnailError} />
                          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">Preview</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                      <input 
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        value={siteForm.hero.buttonText}
                        onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, buttonText: e.target.value}})}
                      />
                    </div>
                  </form>
                </div>

                {/* Promo Banner */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                      <Image size={18} className="text-gold-600" />
                      Banner Promocional
                    </h2>
                  </div>
                  <form className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <input 
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        value={siteForm.promoBanner.title}
                        onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, title: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        rows={2}
                        value={siteForm.promoBanner.text}
                        onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, text: e.target.value}})}
                      />
                    </div>
                    <ImageUpload
                      label="Imagem de Fundo"
                      value={siteForm.promoBanner.image}
                      onChange={(value) => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, image: value}})}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                      <input 
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        value={siteForm.promoBanner.buttonText}
                        onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, buttonText: e.target.value}})}
                      />
                    </div>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden xl:col-span-2">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                      <Phone size={18} className="text-gold-600" />
                      Informações de Contacto
                    </h2>
                  </div>
                  <form className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Morada</label>
                        <input 
                          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.address}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, address: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input 
                          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.phone}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, phone: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.email}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, email: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Horário (Semana)</label>
                        <input 
                          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.scheduleWeek}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, scheduleWeek: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Horário (Fim de Semana)</label>
                        <input 
                          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.scheduleWeekend}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, scheduleWeekend: e.target.value}})}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Business Settings - Configurações de Funcionamento */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-gold-600" />
                    Configurações de Funcionamento
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Dia de Folga */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dia de Folga Semanal</label>
                    <select
                      value={siteForm.businessSettings?.closedDay ?? 1}
                      onChange={e => setSiteForm({
                        ...siteForm, 
                        businessSettings: {
                          ...siteForm.businessSettings,
                          closedDay: parseInt(e.target.value),
                          isAcceptingOrders: siteForm.businessSettings?.isAcceptingOrders ?? true,
                          notAcceptingMessage: siteForm.businessSettings?.notAcceptingMessage ?? 'De momento não estamos a aceitar encomendas. Voltaremos em breve!'
                        }
                      })}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    >
                      <option value={0}>Domingo</option>
                      <option value={1}>Segunda-feira</option>
                      <option value={2}>Terça-feira</option>
                      <option value={3}>Quarta-feira</option>
                      <option value={4}>Quinta-feira</option>
                      <option value={5}>Sexta-feira</option>
                      <option value={6}>Sábado</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Os clientes não poderão agendar entregas/levantamentos neste dia.
                    </p>
                  </div>

                  {/* Toggle Aceitar Encomendas */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Aceitar Encomendas</label>
                        <p className="text-xs text-gray-500 mt-1">
                          Desative para pausar temporariamente o recebimento de encomendas
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSiteForm({
                          ...siteForm,
                          businessSettings: {
                            ...siteForm.businessSettings,
                            closedDay: siteForm.businessSettings?.closedDay ?? 1,
                            isAcceptingOrders: !(siteForm.businessSettings?.isAcceptingOrders ?? true),
                            notAcceptingMessage: siteForm.businessSettings?.notAcceptingMessage ?? 'De momento não estamos a aceitar encomendas. Voltaremos em breve!'
                          }
                        })}
                        className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 ${
                          siteForm.businessSettings?.isAcceptingOrders !== false ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            siteForm.businessSettings?.isAcceptingOrders !== false ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Status Indicator */}
                    <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                      siteForm.businessSettings?.isAcceptingOrders !== false 
                        ? 'bg-emerald-50 border border-emerald-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      {siteForm.businessSettings?.isAcceptingOrders !== false ? (
                        <>
                          <CheckCircle size={20} className="text-emerald-600" />
                          <div>
                            <p className="font-medium text-emerald-800">A aceitar encomendas</p>
                            <p className="text-xs text-emerald-600">Os clientes podem fazer encomendas normalmente.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={20} className="text-red-600" />
                          <div>
                            <p className="font-medium text-red-800">Encomendas pausadas</p>
                            <p className="text-xs text-red-600">Os clientes verão a mensagem de indisponibilidade.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mensagem de Indisponibilidade */}
                  {siteForm.businessSettings?.isAcceptingOrders === false && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem para Clientes
                      </label>
                      <textarea
                        value={siteForm.businessSettings?.notAcceptingMessage || 'De momento não estamos a aceitar encomendas. Voltaremos em breve!'}
                        onChange={e => setSiteForm({
                          ...siteForm,
                          businessSettings: {
                            ...siteForm.businessSettings,
                            closedDay: siteForm.businessSettings?.closedDay ?? 1,
                            isAcceptingOrders: false,
                            notAcceptingMessage: e.target.value
                          }
                        })}
                        rows={3}
                        placeholder="Mensagem que será exibida aos clientes..."
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSiteConfigSave}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                  siteSaved 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gold-600 text-white hover:bg-gold-700 shadow-gold-200'
                }`}
              >
                {siteSaved ? <CheckCircle size={22} /> : <Save size={22} />}
                {siteSaved ? 'Alterações Guardadas com Sucesso!' : 'Guardar Todas as Alterações'}
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Product Edit Modal */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingProduct(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 text-white p-5 flex justify-between items-center z-10">
              <div>
                <h3 className="font-bold text-lg">
                  {products.some(p => p.id === productForm.id) ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <p className="text-gray-400 text-sm">Preencha todos os campos obrigatórios</p>
              </div>
              <button 
                onClick={() => setIsEditingProduct(false)} 
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleProductSave} className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="flex gap-6">
                <div className="w-40 h-40 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {productForm.image ? (
                    <img 
                      src={productForm.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={handleThumbnailError}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Image size={32} />
                      <span className="text-xs mt-2">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto *</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                      placeholder="Ex: Pastel de Nata"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {productForm.category === 'Especiais' ? 'Preço (€) - Opcional' : 'Preço (€) *'}
                      </label>
                      {productForm.category === 'Especiais' ? (
                        <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 text-gold-700 text-sm font-medium">
                          ✨ Sob Orçamento (preço não exibido)
                        </div>
                      ) : (
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            required={productForm.category !== 'Especiais'}
                            value={productForm.price || ''}
                            onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                            className="w-full border border-gray-200 rounded-lg p-3 pl-9 focus:ring-2 focus:ring-gold-400 outline-none"
                            placeholder={productForm.category === 'Bolos de Aniversário' ? '0.00 /Kg' : '0.00'}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                      <select 
                        value={productForm.category}
                        onChange={e => {
                          const newCat = e.target.value;
                          const isPronto = newCat === 'Pronto para Comer';
                          setProductForm({
                            ...productForm, 
                            category: newCat,
                            hasDoses: isPronto ? true : productForm.hasDoses,
                            allowStateSelection: isPronto ? true : productForm.allowStateSelection
                          });
                        }}
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none bg-white"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                <textarea 
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none resize-none"
                  placeholder="Descreva o produto de forma apelativa..."
                />
              </div>

              {/* Opções de Dose e Estado (Especial para Pronto para Comer ou ativação manual) */}
              <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-gold-600" />
                  Opções Avançadas e Preços por Dose/Estado
                </h4>
                
                <div className="flex flex-wrap gap-6 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={productForm.hasDoses}
                        onChange={e => setProductForm({...productForm, hasDoses: e.target.checked})}
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${productForm.hasDoses ? 'bg-gold-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${productForm.hasDoses ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Ativar 1 Dose / Meia Dose</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={productForm.allowStateSelection}
                        onChange={e => setProductForm({...productForm, allowStateSelection: e.target.checked})}
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${productForm.allowStateSelection ? 'bg-gold-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${productForm.allowStateSelection ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Ativar Congelado / Pronto a Comer</span>
                  </label>
                </div>

                {(productForm.hasDoses || productForm.allowStateSelection) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    {/* Caso tenha ambos (Doses e Estados) */}
                    {(productForm.hasDoses && productForm.allowStateSelection) ? (
                      <>
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preços: Pronto a Comer</p>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">1 Dose (Pronto) (€)</label>
                            <div className="relative">
                              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="number" step="0.01"
                                value={productForm.priceFullDoseReady || ''}
                                onChange={e => setProductForm({...productForm, priceFullDoseReady: parseFloat(e.target.value) || 0})}
                                className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Meia Dose (Pronto) (€)</label>
                            <div className="relative">
                              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="number" step="0.01"
                                value={productForm.priceHalfDoseReady || ''}
                                onChange={e => setProductForm({...productForm, priceHalfDoseReady: parseFloat(e.target.value) || 0})}
                                className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preços: Congelado</p>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">1 Dose (Congelado) (€)</label>
                            <div className="relative">
                              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="number" step="0.01"
                                value={productForm.priceFullDoseFrozen || ''}
                                onChange={e => setProductForm({...productForm, priceFullDoseFrozen: parseFloat(e.target.value) || 0})}
                                className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Meia Dose (Congelado) (€)</label>
                            <div className="relative">
                              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="number" step="0.01"
                                value={productForm.priceHalfDoseFrozen || ''}
                                onChange={e => setProductForm({...productForm, priceHalfDoseFrozen: parseFloat(e.target.value) || 0})}
                                className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : productForm.hasDoses ? (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Preço 1 Dose (€)</label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="number" step="0.01"
                              value={productForm.priceFullDose || ''}
                              onChange={e => setProductForm({...productForm, priceFullDose: parseFloat(e.target.value) || 0})}
                              className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Preço Meia Dose (€)</label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="number" step="0.01"
                              value={productForm.priceHalfDose || ''}
                              onChange={e => setProductForm({...productForm, priceHalfDose: parseFloat(e.target.value) || 0})}
                              className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Preço Pronto a Comer (€)</label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="number" step="0.01"
                              value={productForm.priceReady || ''}
                              onChange={e => setProductForm({...productForm, priceReady: parseFloat(e.target.value) || 0})}
                              className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Preço Congelado (€)</label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="number" step="0.01"
                              value={productForm.priceFrozen || ''}
                              onChange={e => setProductForm({...productForm, priceFrozen: parseFloat(e.target.value) || 0})}
                              className="w-full border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <ImageUpload
                label="Imagem do Produto"
                value={productForm.image}
                onChange={(value) => setProductForm({...productForm, image: value})}
                required
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditingProduct(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${
                    productSavedSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gold-600 text-white hover:bg-gold-700 shadow-gold-200'
                  }`}
                >
                  {productSavedSuccess ? <CheckCircle size={20} /> : <Save size={20} />}
                  {productSavedSuccess ? 'Guardado!' : 'Guardar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminar Produto?</h3>
              <p className="text-gray-500 mb-6">Esta ação não pode ser revertida. O produto será removido permanentemente.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Sim, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Edit Modal */}
      {isEditingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingTestimonial(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 text-white p-5 flex justify-between items-center z-10">
              <div>
                <h3 className="font-bold text-lg">
                  {testimonials.some(t => t.id === testimonialForm.id) ? 'Editar Avaliação' : 'Nova Avaliação'}
                </h3>
                <p className="text-gray-400 text-sm">Preencha os dados do cliente e avaliação</p>
              </div>
              <button 
                onClick={() => setIsEditingTestimonial(false)} 
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleTestimonialSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente *</label>
                  <input 
                    type="text" 
                    required
                    value={testimonialForm.name}
                    onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input 
                    type="text" 
                    value={testimonialForm.date}
                    onChange={e => setTestimonialForm({...testimonialForm, date: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    placeholder="Ex: 15 Dez 2025"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL do Avatar (opcional)</label>
                <input 
                  type="url" 
                  value={testimonialForm.avatar}
                  onChange={e => setTestimonialForm({...testimonialForm, avatar: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                  placeholder="Deixe vazio para gerar automaticamente"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação *</label>
                  <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTestimonialForm({...testimonialForm, rating: star})}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={24} 
                          className={star <= testimonialForm.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200'} 
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{testimonialForm.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produto (opcional)</label>
                  <select 
                    value={testimonialForm.product}
                    onChange={e => setTestimonialForm({...testimonialForm, product: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none bg-white"
                  >
                    <option value="">Nenhum produto específico</option>
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto da Avaliação *</label>
                <textarea 
                  required
                  rows={4}
                  value={testimonialForm.text}
                  onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none resize-none"
                  placeholder="O que o cliente disse sobre a experiência..."
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={testimonialForm.isApproved}
                  onChange={e => setTestimonialForm({...testimonialForm, isApproved: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                />
                <label htmlFor="isApproved" className="flex-1">
                  <span className="font-medium text-gray-900">Aprovar avaliação</span>
                  <p className="text-sm text-gray-500">Avaliações aprovadas aparecem na página inicial</p>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditingTestimonial(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${
                    testimonialSavedSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gold-600 text-white hover:bg-gold-700 shadow-gold-200'
                  }`}
                >
                  {testimonialSavedSuccess ? <CheckCircle size={20} /> : <Save size={20} />}
                  {testimonialSavedSuccess ? 'Guardado!' : 'Guardar Avaliação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Testimonial Confirmation Modal */}
      {showDeleteTestimonialConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteTestimonialConfirm(null)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminar Avaliação?</h3>
              <p className="text-gray-500 mb-6">Esta ação não pode ser revertida. A avaliação será removida permanentemente.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteTestimonialConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDeleteTestimonial}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Sim, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Edit Modal */}
      {isEditingBlogPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingBlogPost(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {blogPosts.some(p => p.id === blogPostForm.id) ? 'Editar História' : 'Nova História'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Preencha os campos abaixo</p>
              </div>
              <button 
                onClick={() => setIsEditingBlogPost(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleBlogPostSave} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input 
                  type="text" 
                  required
                  value={blogPostForm.title}
                  onChange={e => setBlogPostForm({ ...blogPostForm, title: e.target.value })}
                  placeholder="Ex: Como escolher o bolo perfeito"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resumo/Excerto *</label>
                <textarea 
                  required
                  rows={2}
                  value={blogPostForm.excerpt}
                  onChange={e => setBlogPostForm({ ...blogPostForm, excerpt: e.target.value })}
                  placeholder="Breve descrição que aparece na listagem..."
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo Completo</label>
                <textarea 
                  rows={6}
                  value={blogPostForm.content}
                  onChange={e => setBlogPostForm({ ...blogPostForm, content: e.target.value })}
                  placeholder="Escreva aqui o conteúdo completo da história..."
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input 
                  type="text" 
                  value={blogPostForm.date}
                  onChange={e => setBlogPostForm({ ...blogPostForm, date: e.target.value })}
                  placeholder="Ex: 15 Dez 2025"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none"
                />
              </div>

              <ImageUpload
                label="Imagem de Capa"
                value={blogPostForm.image}
                onChange={(value) => setBlogPostForm({ ...blogPostForm, image: value })}
              />
              
              {/* Save Button */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditingBlogPost(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
                    blogPostSavedSuccess 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gold-600 text-white hover:bg-gold-700'
                  }`}
                >
                  {blogPostSavedSuccess ? (
                    <><CheckCircle size={20} /> Guardado!</>
                  ) : (
                    <><Save size={20} /> Guardar História</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
