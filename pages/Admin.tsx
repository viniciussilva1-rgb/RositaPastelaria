import React, { useState, useMemo } from 'react';
import { useShop } from '../context';
import { 
  Package, LogOut, Plus, Edit2, Trash2, X, Save, 
  DollarSign, Image, Layout, Phone, Check, Search,
  BarChart3, ShoppingBag, TrendingUp, Eye, EyeOff,
  Grid3X3, List, ChevronDown, Upload, RefreshCw,
  AlertCircle, CheckCircle, Clock, Users, Cake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, SiteConfig, Order } from '../types';

// Categorias disponíveis
const CATEGORIES = ['Bolos de Aniversário', 'Salgados', 'Kits Festa', 'Doces', 'Bebidas', 'Especiais'];

const Admin: React.FC = () => {
  const { 
    user, logout, orders, products, 
    addProduct, updateProduct, deleteProduct, 
    siteConfig, updateSiteConfig 
  } = useShop();
  const navigate = useNavigate();

  // Tab States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'site'>('dashboard');
  
  // Product States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const emptyProduct: Product = { id: '', name: '', description: '', price: 0, image: '', category: 'Salgados' };
  const [productForm, setProductForm] = useState<Product>(emptyProduct);
  const [productSavedSuccess, setProductSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Site Editor State
  const [siteForm, setSiteForm] = useState<SiteConfig>(siteConfig);
  const [siteSaved, setSiteSaved] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
    const categoryCounts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalProducts, totalOrders, totalRevenue, pendingOrders, categoryCounts };
  }, [products, orders]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

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

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteProduct(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || productForm.price <= 0) {
      alert("Por favor preencha o nome e um preço válido.");
      return;
    }
    
    const cleanedProduct = {
      ...productForm,
      image: productForm.image.trim()
    };

    if (products.some(p => p.id === cleanedProduct.id)) {
      updateProduct(cleanedProduct);
    } else {
      addProduct(cleanedProduct);
    }
    
    setProductSavedSuccess(true);
    setTimeout(() => {
      setIsEditingProduct(false);
      setProductSavedSuccess(false);
    }, 600);
  };

  const handleSiteConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(siteForm);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 3000);
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
          {(['dashboard', 'products', 'orders', 'site'] as const).map(tab => (
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
              {tab === 'orders' && 'Encomendas'}
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
                      <Grid3X3 size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.categoryCounts).length}</p>
                  <p className="text-sm text-gray-500 mt-1">Categorias Ativas</p>
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
                              style={{ width: `${(count / stats.totalProducts) * 100}%` }}
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
                        {CATEGORIES.map(cat => (
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
                              <span className="font-bold text-gray-900">€{product.price.toFixed(2)}</span>
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
                        <p className="text-lg font-bold text-gold-600">€{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === ORDERS === */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Encomendas</h1>
                <p className="text-gray-500">Gerir e acompanhar todas as encomendas</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                  <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ainda não há encomendas registadas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">Encomenda #{order.id}</span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{order.date} • {order.paymentMethod}</p>
                        </div>
                        <p className="text-2xl font-bold text-gold-600">€{order.total.toFixed(2)}</p>
                      </div>
                      
                      <div className="p-6">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-gray-500 uppercase">
                              <th className="text-left pb-3">Item</th>
                              <th className="text-center pb-3">Qtd</th>
                              <th className="text-right pb-3">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-3 text-gray-800">{item.name}</td>
                                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                <td className="py-3 text-right font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo (URL)</label>
                      <input 
                        className="w-full border border-gray-200 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        value={siteForm.promoBanner.image}
                        onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, image: e.target.value}})}
                      />
                      {siteForm.promoBanner.image && (
                        <div className="mt-3 relative h-32 rounded-lg overflow-hidden bg-gray-100">
                          <img src={siteForm.promoBanner.image} alt="Preview" className="w-full h-full object-cover" onError={handleThumbnailError} />
                          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">Preview</span>
                        </div>
                      )}
                    </div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preço (€) *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="number" 
                          step="0.01"
                          min="0"
                          required
                          value={productForm.price || ''}
                          onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                          className="w-full border border-gray-200 rounded-lg p-3 pl-9 focus:ring-2 focus:ring-gold-400 outline-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                      <select 
                        value={productForm.category}
                        onChange={e => setProductForm({...productForm, category: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 outline-none bg-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem *</label>
                <div className="relative">
                  <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="url" 
                    required
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={productForm.image}
                    onChange={e => setProductForm({...productForm, image: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-3 pl-9 font-mono text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Dica: Use sites como Unsplash ou Imgur para hospedar imagens gratuitamente.
                </p>
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
    </div>
  );
};

export default Admin;
