import React, { useState } from 'react';
import { useShop } from '../context';
import { ShoppingCart } from 'lucide-react';

const Menu: React.FC = () => {
  const { addToCart, products } = useShop();
  const [filter, setFilter] = useState<string>('Todos');
  
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = filter === 'Todos' 
    ? products 
    : products.filter(p => p.category === filter);

  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x450/F0EAD6/944D46?text=Rosita+Pastelaria';
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold-600 text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-4 block">Pastelaria Artesanal</span>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6">A Nossa Coleção</h1>
          <div className="w-16 h-[2px] bg-gray-200 mx-auto"></div>
        </div>

        {/* Minimalist Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`pb-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                filter === cat 
                ? 'text-gray-900 border-b-2 border-gold-500' 
                : 'text-gray-400 border-b-2 border-transparent hover:text-gold-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {filteredProducts.map(product => (
            <div key={product.id} className="group">
              <div className="relative h-[450px] overflow-hidden mb-6 bg-cream-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Always Visible Price Tag - Elegant */}
                <div className="absolute top-0 right-0 bg-white px-4 py-2 shadow-sm">
                   <span className="font-serif italic font-medium text-gray-900">€{product.price.toFixed(2)}</span>
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-end">
                   <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-white text-gray-900 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-gold-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={14} /> Adicionar ao Carrinho
                  </button>
                </div>
              </div>
              
              <div className="text-center px-4">
                <span className="block text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-2">
                  {product.category}
                </span>
                <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-gold-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-serif italic">
            Não existem produtos nesta categoria de momento.
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;