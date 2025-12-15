import React, { useState } from 'react';
import { useShop } from '../context';
import { Package, User as UserIcon, LogOut, RefreshCcw, Settings, Plus, Edit2, Trash2, X, Save, DollarSign, Image, FileText, Layout, Store, Phone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, SiteConfig } from '../types';

const ClientArea: React.FC = () => {
  const { user, login, adminLogin, logout, orders, products, addProduct, updateProduct, deleteProduct, siteConfig, updateSiteConfig } = useShop();
  const navigate = useNavigate();

  // Admin View States
  const [activeTab, setActiveTab] = useState<'products' | 'site'>('products');
  
  // Product Editor States
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const emptyProduct: Product = { id: '', name: '', description: '', price: 0, image: '', category: 'Salgados' };
  const [productForm, setProductForm] = useState<Product>(emptyProduct);
  const [productSavedSuccess, setProductSavedSuccess] = useState(false);

  // Site Editor State
  const [siteForm, setSiteForm] = useState<SiteConfig>(siteConfig);
  const [siteSaved, setSiteSaved] = useState(false);

  // Fallback para imagens quebradas (Thumbnail)
  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/100?text=Sem+Img';
  };

  // --- Handlers: Products ---
  const handleEditProductClick = (product: Product) => {
    // Create a deep copy to ensure inputs are editable and detached from current state until saved
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
    if (confirm('Tem a certeza que deseja eliminar este produto?')) {
      deleteProduct(id);
    }
  };

  const handleProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate basic fields
    if (!productForm.name || productForm.price <= 0) {
      alert("Por favor preencha o nome e um preço válido.");
      return;
    }
    
    // Clean up data
    const cleanedProduct = {
        ...productForm,
        image: productForm.image.trim()
    };

    if (products.some(p => p.id === cleanedProduct.id)) {
      updateProduct(cleanedProduct);
    } else {
      addProduct(cleanedProduct);
    }
    
    // Show success feedback inside modal before closing or just close
    setProductSavedSuccess(true);
    setTimeout(() => {
      setIsEditingProduct(false);
      setProductSavedSuccess(false);
    }, 500);
  };

  // --- Handlers: Site Config ---
  const handleSiteConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(siteForm);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 3000);
  };

  // Login View
  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-600">
            <UserIcon size={32} />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-2">Bem-vindo à Rosita</h2>
          <p className="text-gray-500 mb-8">Faça login para aceder.</p>
          
          <div className="space-y-3">
            <button 
              onClick={login}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors group"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span className="text-gray-700 font-medium group-hover:text-gray-900">Entrar como Cliente</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Administração</span>
              </div>
            </div>

            <button 
              onClick={adminLogin}
              className="w-full flex items-center justify-center gap-3 py-3 bg-gray-900 text-white rounded hover:bg-gold-600 transition-colors"
            >
              <Settings size={18} />
              <span className="font-medium">Entrar como Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em Produção': return 'bg-blue-100 text-blue-800';
      case 'Entregue': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ----------------------------------------------------------------------
  // ADMIN DASHBOARD VIEW
  // ----------------------------------------------------------------------
  if (user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white p-6 rounded-lg shadow-sm border-l-4 border-gold-500 gap-4">
            <div>
              <h1 className="text-2xl font-serif text-gray-900 font-bold">Painel de Administração</h1>
              <p className="text-gray-500 text-sm">Olá {user.name}, o que deseja gerir hoje?</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { logout(); navigate('/'); }} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors flex items-center gap-2">
                <LogOut size={20} /> <span className="text-sm font-bold">Sair</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-gold-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gold-50'}`}
            >
              <Store size={18} /> Produtos da Vitrine
            </button>
            <button 
              onClick={() => setActiveTab('site')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'site' ? 'bg-gold-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gold-50'}`}
            >
              <Layout size={18} /> Editar Site (Home & Contactos)
            </button>
          </div>

          {/* === CONTENT: PRODUCTS TAB === */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Inventário de Produtos</h2>
                <button 
                  onClick={handleNewProductClick}
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-bold uppercase tracking-wider"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-900 uppercase font-bold text-xs tracking-wider">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Preço</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 flex items-center gap-4">
                          <img 
                            src={product.image} 
                            alt="" 
                            onError={handleThumbnailError}
                            className="w-10 h-10 rounded object-cover bg-gray-100" 
                          />
                          <div>
                            <div className="font-bold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-cream-200 text-gray-800 px-2 py-1 rounded text-xs font-bold">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-900">€{product.price.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditProductClick(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteProductClick(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === CONTENT: SITE EDITOR TAB === */}
          {activeTab === 'site' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Form Section */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Layout size={18} /> Editar Página Inicial
                  </h2>
                 </div>
                 <form onSubmit={handleSiteConfigSave} className="p-6 space-y-8">
                    
                    {/* Hero Section Edit */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gold-600 uppercase tracking-wider border-b border-gray-100 pb-2">Topo da Página (Hero)</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título Principal</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.hero.title}
                          onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, title: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtítulo</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          rows={3}
                          value={siteForm.hero.subtitle}
                          onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, subtitle: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagem de Fundo (URL)</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm font-mono text-gray-900 bg-white focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.hero.image}
                          onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, image: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Texto do Botão</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.hero.buttonText}
                          onChange={e => setSiteForm({...siteForm, hero: {...siteForm.hero, buttonText: e.target.value}})}
                        />
                      </div>
                    </div>

                    {/* Banner Edit */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gold-600 uppercase tracking-wider border-b border-gray-100 pb-2">Banner Promocional (Fundo)</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.promoBanner.title}
                          onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, title: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Texto</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          rows={2}
                          value={siteForm.promoBanner.text}
                          onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, text: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagem de Fundo (URL)</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm font-mono text-gray-900 bg-white focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.promoBanner.image}
                          onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, image: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Texto do Botão</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.promoBanner.buttonText}
                          onChange={e => setSiteForm({...siteForm, promoBanner: {...siteForm.promoBanner, buttonText: e.target.value}})}
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded font-bold uppercase hover:bg-gold-600 transition-colors shadow-lg flex justify-center items-center gap-2">
                      <Save size={18} /> {siteSaved ? 'Alterações Guardadas!' : 'Guardar Alterações'}
                    </button>
                 </form>
              </div>

              {/* Contact Info Edit */}
              <div className="bg-white rounded-lg shadow overflow-hidden h-fit">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Phone size={18} /> Contactos & Rodapé
                  </h2>
                 </div>
                 <form onSubmit={handleSiteConfigSave} className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Morada</label>
                      <input 
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                        value={siteForm.contact.address}
                        onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, address: e.target.value}})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.phone}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, phone: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.email}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, email: e.target.value}})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horário (Semana)</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.scheduleWeek}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, scheduleWeek: e.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horário (Fim de Semana)</label>
                        <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none" 
                          value={siteForm.contact.scheduleWeekend}
                          onChange={e => setSiteForm({...siteForm, contact: {...siteForm.contact, scheduleWeekend: e.target.value}})}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded font-bold uppercase hover:bg-gray-50 transition-colors">
                      Atualizar Contactos
                    </button>
                 </form>
              </div>
            </div>
          )}

        </div>

        {/* Modal Editor (Products) - SUPER HIGH Z-INDEX */}
        {isEditingProduct && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingProduct(false)}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 transform transition-all scale-100">
              <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <h3 className="font-bold text-lg">{products.some(p => p.id === productForm.id) ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button onClick={() => setIsEditingProduct(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleProductSave} className="p-6 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                    className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço (€)</label>
                    <div className="relative">
                      {/* Added pointer-events-none to prevent icon from blocking input focus */}
                      <DollarSign size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={productForm.price || ''}
                        onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                        className="w-full border border-gray-300 rounded p-2 pl-8 bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                    <select 
                      value={productForm.category}
                      onChange={e => setProductForm({...productForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 outline-none"
                    >
                      <option value="Bolos de Aniversário">Bolos de Aniversário</option>
                      <option value="Salgados">Salgados</option>
                      <option value="Kits Festa">Kits Festa</option>
                      <option value="Doces">Doces</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL da Imagem (Link)</label>
                  <div className="relative">
                    {/* Added pointer-events-none */}
                    <Image size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      placeholder="Cole o link da imagem aqui..."
                      value={productForm.image}
                      onChange={e => setProductForm({...productForm, image: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 pl-8 bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                  <textarea 
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 focus:ring-2 focus:ring-gold-400 outline-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProduct(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-bold"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className={`px-6 py-2 text-white rounded text-sm font-bold shadow-md flex items-center gap-2 transition-colors ${productSavedSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gold-600 hover:bg-gold-500'}`}
                  >
                    {productSavedSuccess ? <Check size={16} /> : <Save size={16} />}
                    {productSavedSuccess ? 'Guardado!' : 'Guardar'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // CLIENT AREA VIEW (Original)
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-gold-400" />
            <div>
              <h1 className="text-2xl font-serif text-gray-800">Olá, {user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Terminar Sessão
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={20} className="text-gold-600" /> Histórico de Encomendas
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Ainda não tem encomendas registadas.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">ID: {order.id}</span>
                      <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {order.items.map((item, idx) => (
                        <li key={`${order.id}-${idx}`} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.quantity}x {item.name}</span>
                          <span className="font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">Pagamento: {order.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-xl font-serif font-bold text-gold-600">€{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* User Details Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Dados Pessoais</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Estado da Conta</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-green-700 font-medium">Ativo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gold-50 p-6 rounded-lg border border-gold-200">
              <h3 className="font-serif text-lg text-gold-800 mb-2">Quer repetir uma encomenda?</h3>
              <p className="text-sm text-gold-700 mb-4">É fácil voltar a pedir os seus favoritos.</p>
              <button className="flex items-center gap-2 text-gold-900 text-sm font-bold uppercase tracking-wide hover:underline">
                <RefreshCcw size={16} /> Ver últimas compras
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientArea;