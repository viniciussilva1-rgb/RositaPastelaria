import React, { useEffect, useState } from 'react';
import { useShop } from '../context';
import { Package, User as UserIcon, LogOut, RefreshCcw, Settings, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientArea: React.FC = () => {
  const { user, login, loginWithEmail, register, adminLogin, logout, orders, authLoading } = useShop();
  const navigate = useNavigate();

  const userOrders = React.useMemo(() => {
    return orders.filter(order => order.userId === user?.id);
  }, [orders, user]);
  
  // Auth view states
  const [authMode, setAuthMode] = useState<'options' | 'login' | 'register' | 'admin'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
      const success = await adminLogin(email, password);
      if (!success) {
        setLoginError('Apenas administradores podem aceder a esta área.');
      }
    } catch (error: any) {
      console.error('Erro no login admin:', error);
      setLoginError('Credenciais inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error: any) {
      console.error('Erro no login:', error);
      setLoginError('Email ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setLoginError('Por favor insira o seu nome.');
      return;
    }
    setLoginError('');
    setIsLoading(true);
    try {
      await register(email, password, name);
    } catch (error: any) {
      console.error('Erro no registo:', error);
      if (error.code === 'auth/email-already-in-use') {
        setLoginError('Este email já está em uso.');
      } else {
        setLoginError('Erro ao criar conta. Tente novamente.');
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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-600">
              <UserIcon size={32} />
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-1">
              {authMode === 'register' ? 'Criar Conta' : authMode === 'admin' ? 'Acesso Administrativo' : 'Bem-vindo à Rosita'}
            </h2>
            <p className="text-gray-500 text-sm">
              {authMode === 'register' ? 'Junte-se a nós para encomendar facilmente.' : 'Inicie sessão para continuar.'}
            </p>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}
          
          {authMode === 'options' ? (
            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors group disabled:opacity-50"
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
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase px-2 bg-white text-gray-400">
                  ou
                </div>
              </div>

              <button 
                onClick={() => setAuthMode('login')}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-900 text-gray-900 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                <Mail size={18} />
                Entrar com Email
              </button>

              <button 
                onClick={() => setAuthMode('register')}
                className="w-full text-sm text-gold-600 hover:text-gold-700 font-medium transition-colors"
              >
                Não tem conta? Registe-se aqui
              </button>

              <div className="pt-6 border-t border-gray-50">
                <button 
                  onClick={() => setAuthMode('admin')}
                  className="w-full flex items-center justify-center gap-3 py-2 text-gray-400 hover:text-gray-600 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <Settings size={14} /> Administração
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={authMode === 'login' ? handleEmailLogin : authMode === 'register' ? handleRegister : handleAdminLogin} className="space-y-4">
              {authMode === 'register' && (
                <div className="text-left">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="O seu nome"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="text-left">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authMode === 'admin' ? "admin@rosita.pt" : "exemplo@email.com"}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
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
                className="w-full flex items-center justify-center gap-3 py-3 bg-gray-900 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock size={14} />
                    {authMode === 'login' ? 'Iniciar Sessão' : authMode === 'register' ? 'Criar Conta' : 'Entrar como Admin'}
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setAuthMode('options');
                    setLoginError('');
                    setPassword('');
                  }}
                  className="text-xs text-gray-400 hover:text-gold-600 transition-colors font-bold uppercase tracking-widest"
                >
                  ← Voltar às opções
                </button>
              </div>
            </form>
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

            {userOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Ainda não tem encomendas registadas.</p>
              </div>
            ) : (
              userOrders.map(order => (
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
