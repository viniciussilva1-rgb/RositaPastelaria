import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ClientArea from './pages/ClientArea';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import MaintenanceMode from './components/MaintenanceMode';

// ============================================
// 🚧 MODO DE MANUTENÇÃO
// Altere para true para ativar manutenção
// ============================================
const MAINTENANCE_MODE = false;

const Footer = () => {
  const { siteConfig, getClosedDayName } = useShop();

  // Gerar horário dinâmico baseado no dia de folga
  const getScheduleDisplay = () => {
    const closedDay = siteConfig.businessSettings?.closedDay ?? 1;
    const closedDayName = getClosedDayName();
    
    // Nomes abreviados dos dias
    const dayAbbrev: Record<number, string> = {
      0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb'
    };
    
    // Se o dia fechado for domingo (0), mostrar Seg-Sáb normal
    if (closedDay === 0) {
      return {
        weekDays: 'Seg - Sáb',
        weekendDay: 'Domingo',
        weekSchedule: siteConfig.contact.scheduleWeek,
        weekendSchedule: 'Folga'
      };
    }
    
    // Se o dia fechado for sábado (6)
    if (closedDay === 6) {
      return {
        weekDays: 'Seg - Sex',
        weekendDay: 'Sábado',
        weekSchedule: siteConfig.contact.scheduleWeek,
        weekendSchedule: 'Folga',
        extraDay: 'Domingo',
        extraSchedule: siteConfig.contact.scheduleWeekend
      };
    }
    
    // Se o dia fechado for segunda (1)
    if (closedDay === 1) {
      return {
        weekDays: 'Ter - Sáb',
        weekSchedule: siteConfig.contact.scheduleWeek,
        weekendDay: 'Domingo',
        weekendSchedule: siteConfig.contact.scheduleWeekend,
        extraDay: 'Segunda',
        extraSchedule: 'Folga'
      };
    }
    
    // Para outros dias no meio da semana
    const closedAbbrev = dayAbbrev[closedDay];
    return {
      weekDays: `Dias úteis (exceto ${closedAbbrev})`,
      weekendDay: closedDayName,
      weekSchedule: siteConfig.contact.scheduleWeek,
      weekendSchedule: 'Folga',
      extraDay: 'Domingo',
      extraSchedule: siteConfig.contact.scheduleWeekend
    };
  };

  const schedule = getScheduleDisplay();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="font-serif text-2xl font-bold tracking-wider mb-6 block text-gold-400">ROSITA</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pastelaria especializada em bolos de aniversário e salgados para festas. 
              Tradição e qualidade para os seus momentos especiais desde 2019.
            </p>
          </div>
          <div>
            <h4 className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-6">Encomendas</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>{siteConfig.contact.address}</li>
              <li>{siteConfig.contact.phone}</li>
              <li>{siteConfig.contact.email}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-6">Levantamentos</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex justify-between">
                <span>{schedule.weekDays}</span> 
                <span>{schedule.weekSchedule}</span>
              </li>
              <li className="flex justify-between">
                <span>{schedule.weekendDay}</span> 
                <span className={['Fechado', 'Folga'].includes(schedule.weekendSchedule) ? 'text-red-400 font-bold' : ''}>
                  {schedule.weekendSchedule}
                </span>
              </li>
              {schedule.extraDay && (
                <li className="flex justify-between">
                  <span>{schedule.extraDay}</span> 
                  <span className={['Fechado', 'Folga'].includes(schedule.extraSchedule || '') ? 'text-red-400 font-bold' : ''}>
                    {schedule.extraSchedule}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Rosita Pastelaria. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useShop();
  
  // Se for admin logado, pode ver todas as páginas
  const isAdmin = user?.isAdmin === true;
  
  // Lista de rotas que podem ser acessadas mesmo em manutenção (admin bypass)
  const bypassRoutes = ['/admin', '/admin-bypass', '/cliente', '/login'];
  const isAdminRoute = bypassRoutes.some(route => location.pathname.startsWith(route));
  
  // Se estiver em modo de manutenção E não for rota de admin E não for admin logado, mostrar página de manutenção
  if (MAINTENANCE_MODE && !isAdminRoute && !isAdmin) {
    return <MaintenanceMode />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Menu />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/cliente" element={<ClientArea />} />
          <Route path="/login" element={<ClientArea />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-bypass" element={<Admin />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ShopProvider>
  );
};

export default App;