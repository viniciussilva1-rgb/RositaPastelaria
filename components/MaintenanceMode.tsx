import React from 'react';
import { Cake, Clock, Mail, Instagram, Facebook } from 'lucide-react';

const MaintenanceMode: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full shadow-xl shadow-gold-200 mb-6">
            <Cake size={48} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-2">
            Rosita Pastelaria
          </h1>
          <p className="text-gold-600 font-medium tracking-wide uppercase text-sm">
            Doces Momentos, Sabores Únicos
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gold-100 p-8 sm:p-12 border border-gold-100">
          {/* Construction Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gold-100 rounded-2xl flex items-center justify-center">
                <Clock size={40} className="text-gold-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-4">
              Estamos a Preparar Algo Especial
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              O nosso site está em fase final de construção. Em breve poderá descobrir 
              todos os nossos deliciosos produtos e fazer as suas encomendas online.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"></div>
            <Cake size={20} className="text-gold-400" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"></div>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Enquanto isso, entre em contacto connosco:
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a 
                href="mailto:rositapastelaria@gmail.com" 
                className="flex items-center gap-2 text-gray-700 hover:text-gold-600 transition-colors"
              >
                <Mail size={18} />
                <span>rositapastelaria@gmail.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 hover:bg-gold-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 hover:bg-gold-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Rosita Pastelaria. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Rua de São Sebastião 111, Santa Bárbara, Lourinhã
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
