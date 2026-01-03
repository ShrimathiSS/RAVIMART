import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatPrice } from '../../lib/utils';
import { StatsCard } from '../../components/ui/StatsCard';
import { 
  Package, Trash2, Plus, Users, ShoppingBag, 
  DollarSign, Search, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { Product, OrderStatus } from '../../types';

export const AdminDashboard = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, stats } = useCart();
  const { allUsers, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  // Derived Stats
  const totalRevenue = stats.totalRevenue;
  const returnRequests = orders.filter(o => o.status === 'Return Requested').length;
  const lowStockProducts = products.filter(p => p.stock < 20);

  // Sales Chart
  const salesChartOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [{
      name: 'Sales', type: 'line', smooth: true,
      lineStyle: { width: 4, color: '#4F46E5' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(79, 70, 229, 0.3)' }, { offset: 1, color: 'rgba(79, 70, 229, 0)' }] } },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }]
  };

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=500'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      addProduct({
        id: Math.random().toString(36).substr(2, 9),
        ...newProduct as Product,
        stock: Number(newProduct.stock) || 0,
        price: Number(newProduct.price) || 0,
      });
      setShowAddForm(false);
      setNewProduct({ category: 'electrical', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=500' });
    }
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Return Requested': 'bg-orange-100 text-orange-800',
    'Returned': 'bg-gray-200 text-gray-800'
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
             <ShieldCheck className="w-4 h-4 text-blue-600" />
             <span>Logged in as: <span className="font-semibold text-gray-900">{user?.name}</span> (Administrator)</span>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 overflow-x-auto">
          {['overview', 'products', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} trend="+12.5%" trendUp={true} color="blue" />
            <StatsCard title="Total Orders" value={orders.length} icon={ShoppingBag} trend="+5.2%" trendUp={true} color="purple" />
            <StatsCard title="Active Users" value={allUsers.length} icon={Users} trend="+2.4%" trendUp={true} color="orange" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Analytics</h3>
              <ReactECharts option={salesChartOption} style={{ height: '350px' }} />
            </div>
            
            {/* Low Stock Alert Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Low Stock Alerts
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px]">
                {lowStockProducts.length === 0 ? (
                  <p className="text-gray-500 text-sm">All products are well stocked.</p>
                ) : (
                  lowStockProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{p.name}</p>
                        <p className="text-xs text-red-600 font-bold">Only {p.stock} left</p>
                      </div>
                      <Button size="sm" className="text-xs h-7 px-2 bg-white text-red-600 border border-red-200 hover:bg-red-50">
                        Restock
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Contact</th>
                <th className="p-4 font-semibold text-gray-600">Address</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-600">
                    <div className="text-sm">{u.email}</div>
                    {u.phone && <div className="text-xs text-gray-500">{u.phone}</div>}
                  </td>
                  <td className="p-4 text-gray-600 text-sm max-w-xs truncate">
                    {u.address ? `${u.address}, ${u.city || ''}` : '-'}
                  </td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs uppercase font-bold">{u.role}</span></td>
                  <td className="p-4 text-gray-500">{u.joinDate || '2025-01-01'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Product Name" value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                    <option value="electrical">Electrical</option>
                    <option value="hardware">Hardware</option>
                    <option value="tools">Tools</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="lighting">Lighting</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
                <Input label="Price" type="number" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
                <Input label="Stock" type="number" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} required />
                <Input label="Description" className="col-span-2" value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600">Save Product</Button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Product</th>
                  <th className="p-4 font-semibold text-gray-600">Category</th>
                  <th className="p-4 font-semibold text-gray-600">Price</th>
                  <th className="p-4 font-semibold text-gray-600">Stock</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-medium uppercase bg-gray-100 text-gray-800">{product.category}</span></td>
                    <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                    <td className="p-4">{product.stock} units</td>
                    <td className="p-4 text-right">
                      <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Order Management</h2>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>{returnRequests} Return Requests</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package className="w-6 h-6" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">#{order.id}</span>
                          <span className="text-sm text-gray-500">• {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{order.items.length} items • {formatPrice(order.total)}</p>
                        <p className="text-xs text-gray-400 mt-1">Customer ID: {order.userId}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <select 
                           className="text-sm border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                           value={order.status}
                           onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                         >
                           <option value="Pending">Pending</option>
                           <option value="Processing">Processing</option>
                           <option value="Shipped">Shipped</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                           <option value="Return Requested">Return Requested</option>
                           <option value="Returned">Returned (Approved)</option>
                         </select>
                      </div>
                    </div>
                  </div>
                  
                  {order.status === 'Return Requested' && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4 flex justify-between items-center">
                      <span className="text-orange-800 text-sm font-medium">Customer requested a return for this order.</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => updateOrderStatus(order.id, 'Returned')}>
                        Approve Return
                      </Button>
                    </div>
                  )}

                  <div className="ml-16 bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="font-medium text-gray-700 mb-2">Items:</p>
                    <ul className="space-y-1 text-gray-600">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="p-12 text-center text-gray-500">No orders found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
