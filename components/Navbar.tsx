import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu as MenuIcon, X } from 'lucide-react';
import { useShop } from '../context';

const Navbar: React.FC = () => {
  const { cart, user } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navbar Logic: 
  // If not Home -> Always White/Solid.
  // If Home -> Transparent at top, White when scrolled.
  const navbarClasses = isHome && !scrolled 
    ? "bg-transparent text-white border-transparent" 
    : "bg-white/95 backdrop-blur-md text-gray-800 shadow-sm border-cream-200";

  const logoTextClass = isHome && !scrolled ? "text-white" : "text-gray-900";
  const logoSubClass = isHome && !scrolled ? "text-gold-200" : "text-gold-600";
  const iconClass = isHome && !scrolled ? "text-white hover:text-gold-200" : "text-gray-600 hover:text-gold-600";
  const linkClass = (path: string) => {
    if (location.pathname === path) return "font-bold text-gold-500";
    return isHome && !scrolled ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gold-600";
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navbarClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Desktop Menu Left */}
          <div className="hidden md:flex space-x-8 items-center w-1/3">
            <Link to="/" className={`text-sm uppercase tracking-widest transition-colors ${linkClass('/')}`}>Início</Link>
            <Link to="/produtos" className={`text-sm uppercase tracking-widest transition-colors ${linkClass('/produtos')}`}>Menu</Link>
          </div>

          {/* Logo Center */}
          <div className="w-1/3 flex justify-center">
            <Link to="/" className="flex flex-col items-center group">
              <span className={`font-serif text-3xl font-bold tracking-widest transition-colors duration-300 ${logoTextClass}`}>ROSITA</span>
              <span className={`text-[0.65rem] uppercase tracking-[0.3em] mt-1 transition-colors duration-300 ${logoSubClass}`}>Pastelaria</span>
            </Link>
          </div>

          {/* Desktop Icons Right */}
          <div className="hidden md:flex items-center justify-end space-x-6 w-1/3">
            <Link to="/blog" className={`text-sm uppercase tracking-widest transition-colors mr-4 ${linkClass('/blog')}`}>Histórias</Link>
            
            <Link to={user ? "/cliente" : "/login"} className={`transition-colors ${iconClass}`}>
              <User size={22} strokeWidth={1.5} />
            </Link>
            <Link to="/carrinho" className={`relative transition-colors ${iconClass}`}>
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <Link to="/carrinho" className={`mr-4 relative ${iconClass}`}>
                <ShoppingBag size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            <button onClick={() => setIsOpen(!isOpen)} className={`${iconClass}`}>
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-40 pt-24 px-6">
           <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-500">
              <X size={32} />
           </button>
          <div className="flex flex-col space-y-6 text-center mt-10">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-serif text-gray-900">Início</Link>
            <Link to="/produtos" onClick={() => setIsOpen(false)} className="text-2xl font-serif text-gray-900">Menu</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="text-2xl font-serif text-gray-900">Histórias</Link>
            <div className="w-10 h-1 bg-gold-400 mx-auto my-4"></div>
            <Link to={user ? "/cliente" : "/login"} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest text-gray-500">
              {user ? "Minha Conta" : "Login / Registar"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;