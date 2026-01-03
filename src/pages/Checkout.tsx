import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatPrice } from '../lib/utils';
import { CreditCard, Wallet, Truck, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Checkout = () => {
  const { cartTotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form State
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate realistic payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const order = placeOrder(paymentMethod, {
      name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
      address: shippingDetails.address,
      city: shippingDetails.city,
      zip: shippingDetails.zip
    });
    
    setLoading(false);
    
    if (order) {
      navigate('/payment-success', { state: { order } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-center mb-12">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>1</div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className={`w-24 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>2</div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handlePayment} className="space-y-6">
            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Truck className="w-6 h-6 text-blue-600" /> Shipping Details
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    name="firstName" 
                    label="First Name" 
                    required 
                    placeholder="John" 
                    value={shippingDetails.firstName}
                    onChange={handleInputChange}
                  />
                  <Input 
                    name="lastName" 
                    label="Last Name" 
                    required 
                    placeholder="Doe" 
                    value={shippingDetails.lastName}
                    onChange={handleInputChange}
                  />
                  <Input 
                    name="email" 
                    label="Email" 
                    type="email" 
                    className="col-span-2" 
                    required 
                    placeholder="john@example.com" 
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                  />
                  <Input 
                    name="address" 
                    label="Address" 
                    className="col-span-2" 
                    required 
                    placeholder="123 Industrial Area" 
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                  />
                  <Input 
                    name="city" 
                    label="City" 
                    required 
                    placeholder="Mumbai" 
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                  />
                  <Input 
                    name="zip" 
                    label="ZIP Code" 
                    required 
                    placeholder="400001" 
                    value={shippingDetails.zip}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="button" onClick={() => setStep(2)} className="px-8">
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Lock className="w-6 h-6 text-blue-600" /> Secure Payment
                </h2>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { id: 'card', icon: CreditCard, label: 'Card' },
                    { id: 'upi', icon: Wallet, label: 'UPI' },
                    { id: 'cod', icon: Truck, label: 'COD' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === method.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <method.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-gray-700">Card Details</span>
                       <div className="flex gap-2">
                         <div className="w-8 h-5 bg-gray-200 rounded"></div>
                         <div className="w-8 h-5 bg-gray-200 rounded"></div>
                       </div>
                    </div>
                    <Input 
                      placeholder="0000 0000 0000 0000" 
                      className="bg-white"
                      icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" className="bg-white" />
                      <Input placeholder="CVC" className="bg-white" />
                    </div>
                    <Input placeholder="Cardholder Name" className="bg-white" />
                  </div>
                )}
                
                {paymentMethod === 'upi' && (
                   <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <Input label="UPI ID" placeholder="username@upi" className="bg-white" />
                      <p className="text-xs text-gray-500 mt-2">Open your UPI app to approve the request.</p>
                   </div>
                )}

                <div className="mt-8 flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200" isLoading={loading}>
                    {loading ? 'Processing...' : `Pay ${formatPrice(cartTotal)}`}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
                <span>{formatPrice(cartTotal * 0.18)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-2xl text-blue-600">{formatPrice(cartTotal * 1.18)}</span>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-xl flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Your payment is secure and encrypted. We do not store your credit card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
