import React, { useState } from 'react';
import { useShop } from '../context';
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder, user } = useShop();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setStep('checkout');
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Por favor selecione um método de pagamento.");
      return;
    }
    placeOrder(paymentMethod);
    setStep('success');
  };

  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/150?text=Produto';
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-serif text-gray-800 mb-4">O seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Parece que ainda não escolheu os seus doces favoritos.</p>
        <Link to="/produtos" className="px-8 py-3 bg-gold-600 text-white rounded hover:bg-gold-500 transition-colors uppercase text-sm font-bold tracking-widest">
          Ver Produtos
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-serif text-gray-800 mb-4">Encomenda Recebida!</h2>
        <p className="text-gray-600 mb-6">
          A sua encomenda foi registada com sucesso. O administrador da Rosita Pastelaria recebeu o seu pedido.
          Pode acompanhar o estado na sua Área de Cliente.
        </p>
        <div className="flex gap-4">
           <Link to="/cliente" className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors uppercase text-xs font-bold tracking-widest">
            Ir para Área de Cliente
          </Link>
          <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-700 rounded hover:border-gold-500 transition-colors uppercase text-xs font-bold tracking-widest">
            Voltar à Loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {step === 'checkout' && (
          <button onClick={() => setStep('cart')} className="flex items-center text-gray-500 hover:text-gold-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Voltar ao Carrinho
          </button>
        )}

        <h1 className="text-3xl font-serif text-gray-800 mb-8">
          {step === 'cart' ? 'O seu Carrinho' : 'Finalizar Encomenda'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center p-6 border-b border-gray-100 last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onError={handleImageError}
                    className="w-20 h-20 object-cover rounded-md" 
                  />
                  <div className="ml-6 flex-grow">
                    <h3 className="text-lg font-serif text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm">€{item.price.toFixed(2)} / un</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-gold-600">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-gold-600">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="ml-6 text-right w-24">
                    <p className="font-bold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs mt-1 flex items-center justify-end w-full">
                      <Trash2 size={12} className="mr-1" /> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary / Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Resumo</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxas (IVA inc.)</span>
                  <span>€0.00</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-xl text-gray-800">
                  <span>Total</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gold-600 text-white rounded hover:bg-gold-500 transition-colors uppercase text-sm font-bold tracking-widest shadow-md"
                >
                  Continuar
                </button>
              ) : (
                <form onSubmit={submitOrder} className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 text-sm">Método de Pagamento</h4>
                    <p className="text-xs text-gray-500 mb-3">O pagamento será realizado fora da plataforma.</p>
                    
                    <div className="space-y-2">
                      {['Dinheiro na Entrega', 'MB Way', 'Multibanco', 'Transferência Bancária'].map((method) => (
                        <label key={method} className={`flex items-center p-3 border rounded cursor-pointer transition-all ${paymentMethod === method ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                          <input 
                            type="radio" 
                            name="payment" 
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-gold-600 focus:ring-gold-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors uppercase text-sm font-bold tracking-widest shadow-md"
                  >
                    Confirmar Encomenda
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;