import React, { useEffect, useState } from 'react';
import { useShop } from '../context';
import { Package, User as UserIcon, LogOut, RefreshCcw, Settings, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientArea: React.FC = () => {
  const { user, login, adminLogin, logout, orders, authLoading } = useShop();
  const navigate = useNavigate();
  
  // Admin login states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect admin to admin panel
  useEffect(() => {
    if (user?.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      const success = await adminLogin(adminEmail, adminPassword);
      if (!success) {
        setLoginError('Email ou senha incorretos. Verifique suas credenciais.');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password') {
        setLoginError('Email ou senha incorretos.');
      } else if (error?.code === 'auth/user-not-found') {
        setLoginError('Usuário não encontrado. Verifique o email.');
      } else if (error?.code === 'auth/too-many-requests') {
        setLoginError('Muitas tentativas. Aguarde um momento.');
      } else {
        setLoginError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium font-serif italic">A carregar a sua área...</p>
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
          
          {!showAdminLogin ? (
            <div className="space-y-3">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors group disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gold-600 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">Entrar com Google</span>
                  </>
                )}
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
                onClick={() => setShowAdminLogin(true)}
                className="w-full flex items-center justify-center gap-3 py-3 bg-gray-900 text-white rounded hover:bg-gold-600 transition-colors"
              >
                <Settings size={18} />
                <span className="font-medium">Entrar como Admin</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                {loginError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={16} />
                    {loginError}
                  </div>
                )}
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@rosita.pt"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-gray-900 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      A verificar...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Entrar no Painel Admin
                    </>
                  )}
                </button>
              </form>

              <button 
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminEmail('');
                  setAdminPassword('');
                  setLoginError('');
                }}
                className="text-sm text-gray-500 hover:text-gold-600 transition-colors"
              >
                ← Voltar às opções de login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // CLIENT AREA VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-white shadow-sm" />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-serif text-gray-900">Olá, {user.name}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all text-sm font-bold uppercase tracking-wider shadow-sm"
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
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <LogOut size={14} /> Sair da Conta
                </button>
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
