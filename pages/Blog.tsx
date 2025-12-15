import React from 'react';
import { BLOG_POSTS } from '../constants';
import { Calendar } from 'lucide-react';

const Blog: React.FC = () => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6">Novidades Rosita</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe as nossas histórias, lançamentos de novos sabores e eventos especiais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map(post => (
            <article key={post.id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-4 shadow-sm">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
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

      </div>
    </div>
  );
};

export default Blog;