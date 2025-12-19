import React, { useState } from 'react';
import { useShop } from '../context';
import { Calendar, X, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const { blogPosts } = useShop();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6">Novidades Rosita</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe as nossas histórias, lançamentos de novos sabores e eventos especiais.
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Ainda não há histórias publicadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map(post => (
              <article 
                key={post.id} 
                className="group cursor-pointer"
                onClick={() => openPost(post)}
              >
                <div className="overflow-hidden rounded-lg mb-4 shadow-sm">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/F0EAD6/944D46?text=Rosita+Pastelaria';
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar size={12} />
                  {post.date}
                </div>
                <h2 className="text-2xl font-serif text-gray-800 mb-3 group-hover:text-gold-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <span className="text-gray-900 text-sm font-bold border-b border-gray-300 pb-1 group-hover:border-gold-600 transition-all">
                  Ler mais
                </span>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* Modal para visualizar o post completo */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto"
          onClick={closePost}
        >
          <div 
            className="bg-white w-full max-w-4xl my-8 mx-4 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com imagem */}
            <div className="relative">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/F0EAD6/944D46?text=Rosita+Pastelaria';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Botão fechar */}
              <button 
                onClick={closePost}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-colors shadow-lg"
              >
                <X size={24} />
              </button>
              
              {/* Título sobre a imagem */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Calendar size={14} />
                  {selectedPost.date}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white leading-tight">
                  {selectedPost.title}
                </h1>
              </div>
            </div>
            
            {/* Conteúdo */}
            <div className="p-6 sm:p-8 md:p-10">
              {/* Resumo em destaque */}
              <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed mb-6 pb-6 border-b border-gray-100">
                {selectedPost.excerpt}
              </p>
              
              {/* Conteúdo completo */}
              {selectedPost.content && selectedPost.content !== '...' && (
                <div className="prose prose-lg max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-600 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              )}
              
              {/* Botão voltar */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                  onClick={closePost}
                  className="flex items-center gap-2 text-gold-600 font-bold hover:text-gold-700 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Voltar às histórias
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;