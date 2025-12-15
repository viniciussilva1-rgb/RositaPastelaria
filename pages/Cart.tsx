import React, { useState, useMemo } from 'react';
import { useShop } from '../context';
import { 
  Trash2, Plus, Minus, ArrowLeft, CheckCircle, 
  Calendar, Clock, MapPin, Home, Store, ChevronLeft, ChevronRight,
  Truck, Package
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DeliveryType } from '../types';

// Horários disponíveis
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder, user, getUnavailableDeliverySlots } = useShop();
  const [step, setStep] = useState<'cart' | 'delivery' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  // Delivery states
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get unavailable slots for selected date (only for delivery)
  const unavailableSlots = useMemo(() => {
    if (!selectedDate || deliveryType === 'pickup') return [];
    return getUnavailableDeliverySlots(selectedDate);
  }, [selectedDate, deliveryType, getUnavailableDeliverySlots]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [currentMonth]);

  // Check if a date is valid (not in the past, not Sunday)
  const isDateValid = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Minimum 1 day advance for orders
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 1);
    
    // Not Sunday (0)
    const isSunday = date.getDay() === 0;
    
    return date >= minDate && !isSunday;
  };

  // Format date for display and storage
  const formatDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toLocaleDateString('pt-PT');
  };

  const formatDateDisplay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setStep('delivery');
  };

  const handleDeliveryNext = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecione uma data e horário.');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert('Por favor insira a morada de entrega.');
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
    
    placeOrder(paymentMethod, {
      type: deliveryType,
      date: selectedDate,
      time: selectedTime,
      address: deliveryType === 'delivery' ? deliveryAddress : undefined
    });
    
    setStep('success');
  };

  // Fallback para imagens quebradas
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/150?text=Produto';
  };

  // Previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate('');
    setSelectedTime('');
  };

  // Next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate('');
    setSelectedTime('');
  };

  // Can go to previous month?
  const canGoPrev = () => {
    const today = new Date();
    return currentMonth.getMonth() > today.getMonth() || currentMonth.getFullYear() > today.getFullYear();
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
        <p className="text-gray-600 mb-2">
          A sua encomenda foi registada com sucesso.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left w-full">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">📅 Data:</span> {selectedDate}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">🕐 Horário:</span> {selectedTime}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{deliveryType === 'delivery' ? '🚚 Entrega:' : '🏪 Levantamento:'}</span> {deliveryType === 'delivery' ? deliveryAddress : 'Na loja'}
          </p>
        </div>
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
        
        {/* Back Button */}
        {step !== 'cart' && (
          <button 
            onClick={() => setStep(step === 'checkout' ? 'delivery' : 'cart')} 
            className="flex items-center text-gray-500 hover:text-gold-600 mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> 
            {step === 'delivery' ? 'Voltar ao Carrinho' : 'Voltar à Entrega'}
          </button>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'cart' || step === 'delivery' || step === 'checkout' ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className="ml-2 text-sm font-medium text-gray-700">Carrinho</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step === 'delivery' || step === 'checkout' ? 'bg-gold-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'delivery' || step === 'checkout' ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className="ml-2 text-sm font-medium text-gray-700">Entrega</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step === 'checkout' ? 'bg-gold-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'checkout' ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className="ml-2 text-sm font-medium text-gray-700">Pagamento</span>
          </div>
        </div>

        <h1 className="text-3xl font-serif text-gray-800 mb-8">
          {step === 'cart' && 'O seu Carrinho'}
          {step === 'delivery' && 'Data e Local de Entrega'}
          {step === 'checkout' && 'Finalizar Encomenda'}
        </h1>

        {/* STEP 1: CART */}
        {step === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gold-600 text-white rounded hover:bg-gold-500 transition-colors uppercase text-sm font-bold tracking-widest shadow-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY */}
        {step === 'delivery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Type Selection */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-gold-600" />
                  Como deseja receber a sua encomenda?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType('pickup');
                      setSelectedTime(''); // Reset time when changing type
                    }}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      deliveryType === 'pickup' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        deliveryType === 'pickup' ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Store size={20} />
                      </div>
                      <span className="font-bold text-gray-800">Levantar na Loja</span>
                    </div>
                    <p className="text-sm text-gray-500">Levante a sua encomenda na nossa pastelaria.</p>
                    <p className="text-xs text-gold-600 font-medium mt-2">Grátis</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType('delivery');
                      setSelectedTime(''); // Reset time when changing type
                    }}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      deliveryType === 'delivery' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        deliveryType === 'delivery' ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Truck size={20} />
                      </div>
                      <span className="font-bold text-gray-800">Entrega ao Domicílio</span>
                    </div>
                    <p className="text-sm text-gray-500">Receba a encomenda no conforto da sua casa.</p>
                    <p className="text-xs text-gold-600 font-medium mt-2">Taxa de entrega a combinar</p>
                  </button>
                </div>

                {/* Delivery Address */}
                {deliveryType === 'delivery' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Home size={14} className="inline mr-1" />
                      Morada de Entrega *
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Rua, número, andar, código postal e cidade..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Calendar */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-gold-600" />
                  Selecione a Data
                </h3>
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={prevMonth}
                    disabled={!canGoPrev()}
                    className={`p-2 rounded-lg ${canGoPrev() ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {currentMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button 
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day !== null ? (
                        <button
                          type="button"
                          disabled={!isDateValid(day)}
                          onClick={() => {
                            setSelectedDate(formatDate(day));
                            setSelectedTime('');
                          }}
                          className={`w-full h-full rounded-lg text-sm font-medium transition-all ${
                            selectedDate === formatDate(day)
                              ? 'bg-gold-600 text-white'
                              : isDateValid(day)
                                ? 'hover:bg-gold-100 text-gray-700'
                                : 'text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedDate && (
                  <div className="mt-4 p-3 bg-gold-50 rounded-lg">
                    <p className="text-sm text-gold-800 font-medium capitalize">
                      📅 {formatDateDisplay(parseInt(selectedDate.split('/')[0]))}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  ⚠️ Encomendas com pelo menos 1 dia de antecedência. Encerrado aos domingos.
                </p>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-gold-600" />
                    Selecione o Horário
                    {deliveryType === 'delivery' && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        (Horários ocupados estão indisponíveis)
                      </span>
                    )}
                  </h3>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map(time => {
                      const isUnavailable = deliveryType === 'delivery' && unavailableSlots.includes(time);
                      
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-gold-600 text-white'
                              : isUnavailable
                                ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                                : 'bg-gray-50 text-gray-700 hover:bg-gold-100'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>

                  {deliveryType === 'delivery' && unavailableSlots.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3">
                      🚚 Alguns horários já têm entregas agendadas e não estão disponíveis.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Resumo da Entrega</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {deliveryType === 'pickup' ? <Store size={18} className="text-gold-600" /> : <Truck size={18} className="text-gold-600" />}
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="font-medium text-gray-800">
                        {deliveryType === 'pickup' ? 'Levantar na Loja' : 'Entrega ao Domicílio'}
                      </p>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar size={18} className="text-gold-600" />
                      <div>
                        <p className="text-xs text-gray-500">Data</p>
                        <p className="font-medium text-gray-800">{selectedDate}</p>
                      </div>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock size={18} className="text-gold-600" />
                      <div>
                        <p className="text-xs text-gray-500">Horário</p>
                        <p className="font-medium text-gray-800">{selectedTime}</p>
                      </div>
                    </div>
                  )}

                  {deliveryType === 'delivery' && deliveryAddress && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin size={18} className="text-gold-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Morada</p>
                        <p className="font-medium text-gray-800 text-sm">{deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-xl text-gray-800">
                    <span>Total</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleDeliveryNext}
                  disabled={!selectedDate || !selectedTime || (deliveryType === 'delivery' && !deliveryAddress.trim())}
                  className={`w-full py-4 rounded uppercase text-sm font-bold tracking-widest shadow-md transition-colors ${
                    selectedDate && selectedTime && (deliveryType === 'pickup' || deliveryAddress.trim())
                      ? 'bg-gold-600 text-white hover:bg-gold-500'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continuar para Pagamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CHECKOUT */}
        {step === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Summary */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Resumo da Encomenda</h3>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center py-3 border-b border-gray-50 last:border-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        onError={handleImageError}
                        className="w-12 h-12 object-cover rounded" 
                      />
                      <div className="ml-4 flex-grow">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-700 mb-3 text-sm">Detalhes da Entrega</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tipo</p>
                      <p className="font-medium text-gray-800">
                        {deliveryType === 'pickup' ? '🏪 Levantar na Loja' : '🚚 Entrega ao Domicílio'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Data e Hora</p>
                      <p className="font-medium text-gray-800">{selectedDate} às {selectedTime}</p>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Morada</p>
                        <p className="font-medium text-gray-800">{deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Pagamento</h3>
                
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

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between font-bold text-xl text-gray-800 mb-4">
                      <span>Total</span>
                      <span>€{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors uppercase text-sm font-bold tracking-widest shadow-md"
                  >
                    Confirmar Encomenda
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
