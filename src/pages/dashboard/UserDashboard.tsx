import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { Package, RotateCcw, AlertCircle, User, Mail, Calendar, Shield, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const UserDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { orders, updateOrderStatus } = useCart();
  
  const myOrders = orders.filter(o => o.userId === user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zip: user?.zip || ''
  });

  const handleReturn = (orderId: string) => {
    if (confirm('Are you sure you want to return this order?')) {
      updateOrderStatus(orderId, 'Return Requested');
    }
  };

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your profile and orders</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm">
          <User className="w-4 h-4" />
          Logged in as {user?.role === 'admin' ? 'Administrator' : 'Customer'}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Details Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col items-center text-center relative">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-blue-600"
                title="Edit Profile"
              >
                {isEditing ? <Save className="w-4 h-4" onClick={handleSaveProfile} /> : <Edit2 className="w-4 h-4" />}
              </button>
              
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg uppercase">
                {user?.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {isEditing ? (
                <div className="space-y-4 animate-in fade-in">
                  <Input 
                    label="Phone Number" 
                    value={editForm.phone} 
                    onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                  />
                  <Input 
                    label="Address" 
                    value={editForm.address} 
                    onChange={e => setEditForm({...editForm, address: e.target.value})} 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      label="City" 
                      value={editForm.city} 
                      onChange={e => setEditForm({...editForm, city: e.target.value})} 
                    />
                    <Input 
                      label="Zip" 
                      value={editForm.zip} 
                      onChange={e => setEditForm({...editForm, zip: e.target.value})} 
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">Save Changes</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                      <p className="font-medium text-gray-900">{user?.phone || 'Not added'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Address</p>
                      <p className="font-medium text-gray-900">
                        {user?.address ? `${user.address}, ${user.city} - ${user.zip}` : 'Not added'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Member Since</p>
                      <p className="font-medium text-gray-900">{user?.joinDate || 'Jan 2025'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> Recent Orders
          </h2>

          {myOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="text-gray-500 mt-1 mb-6">Start shopping to see your orders here.</p>
              <Button onClick={() => window.location.href = '/products'}>Browse Products</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-50">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Order ID</p>
                      <p className="font-mono font-medium text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                      <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p>
                      <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Return Requested' ? 'bg-orange-100 text-orange-800' :
                        order.status === 'Returned' ? 'bg-gray-200 text-gray-800' :
                        'bg-blue-50 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                      
                      {order.status === 'Delivered' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-8 border-gray-300 hover:bg-gray-50"
                          onClick={() => handleReturn(order.id)}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> Return Item
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {order.status === 'Return Requested' && (
                    <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center border border-blue-100">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      Return request submitted. Waiting for admin approval.
                    </div>
                  )}

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm items-center bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-10 h-10 object-cover rounded bg-white" />
                          <span className="text-gray-900 font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 text-xs block">Qty: {item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
