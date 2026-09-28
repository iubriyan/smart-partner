'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, RefreshCcw } from 'lucide-react';
import PDFDownload from '@/components/PDFDownload';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState('');
  const [profit, setProfit] = useState('');
  const [courierCharge, setCourierCharge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('smart_orders') || '[]');
    setOrders(savedOrders);
    const savedInv = JSON.parse(localStorage.getItem('smart_inventory') || '[]');
    setInventory(savedInv);
  }, []);

  // Auto-fill customer info if mobile matches previous order
  const handleMobileChange = (val: string) => {
    setMobile(val);
    const found = orders.find((o) => o.mobile === val);
    if (found) {
      setCustomerName(found.customerName);
    }
  };

  const handleProductSelect = (prodName: string) => {
    setSelectedProduct(prodName);
    const prod = inventory.find((p) => p.name === prodName);
    if (prod) {
      setSellPrice(prod.buyPrice.toString());
    }
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now().toString(),
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      productName: selectedProduct,
      quantity: Number(quantity),
      sellPrice: Number(sellPrice),
      profit: Number(profit),
      courierCharge: Number(courierCharge),
      status: 'Delivered',
      date: new Date().toLocaleDateString(),
    };

    const updatedOrders = [...orders, newOrder];
    localStorage.setItem('smart_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    const auditLogs = JSON.parse(localStorage.getItem('smart_audit') || '[]');
    auditLogs.push({
      id: Date.now().toString(),
      user: localStorage.getItem('smart_active_user') || 'Admin',
      action: `Order placed for ${customerName} (${selectedProduct})`,
      time: new Date().toLocaleString(),
    });
    localStorage.setItem('smart_audit', JSON.stringify(auditLogs));

    setCustomerName('');
    setMobile('');
    setSelectedProduct('');
    setQuantity(1);
    setSellPrice('');
    setProfit('');
    setCourierCharge('');
  };

  const toggleReturnStatus = (id: string) => {
    const updated = orders.map((o) => {
      if (o.id === id) {
        const newStatus = o.status === 'Delivered' ? 'Returned' : 'Delivered';
        return { ...o, status: newStatus };
      }
      return o;
    });
    localStorage.setItem('smart_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.mobile.includes(searchTerm) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pdfHeaders = ['Customer', 'Mobile', 'Product', 'Qty', 'Sell Price (৳)', 'Profit (৳)', 'Status'];
  const pdfData = orders.map((o) => ({
    name: o.customerName,
    mobile: o.mobile,
    prod: o.productName,
    qty: o.quantity,
    price: o.sellPrice,
    profit: o.profit,
    status: o.status,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Customer Order & Return Management</h1>
              <p className="text-xs text-gray-500">Auto-fill customer records & manage product delivery/returns</p>
            </div>
          </div>
          <PDFDownload title="Customer Orders Report" headers={pdfHeaders} data={pdfData} filename="customer_orders" />
        </div>

        <form onSubmit={handleAddOrder} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Mobile Number (Auto-fill)</label>
            <input
              type="text"
              required
              value={mobile}
              onChange={(e) => handleMobileChange(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Product from Stock</label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose Product</option>
              {inventory.map((inv, idx) => (
                <option key={idx} value={inv.name}>
                  {inv.name} (Stock: {inv.quantity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Quantity</label>
            <input
              type="number"
              required
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Sell Price (৳)</label>
            <input
              type="number"
              required
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="Sell Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Net Profit (৳)</label>
            <input
              type="number"
              required
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              placeholder="Profit"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Courier Charge (৳)</label>
            <input
              type="number"
              value={courierCharge}
              onChange={(e) => setCourierCharge(e.target.value)}
              placeholder="Courier Fee"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow transition"
            >
              Save Order
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-bold text-gray-900">Customer Orders List</h2>
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, mobile, product..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Sell Price</th>
                <th className="px-4 py-3">Profit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-gray-400 text-xs">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{ord.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{ord.mobile}</td>
                    <td className="px-4 py-3 text-gray-800">{ord.productName}</td>
                    <td className="px-4 py-3 text-gray-600">{ord.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">৳ {ord.sellPrice}</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">৳ {ord.profit}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ord.status === 'Returned' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleReturnStatus(ord.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center space-x-1 bg-indigo-50 px-2.5 py-1 rounded-md"
                        title="Toggle Return / Delivery"
                      >
                        <RefreshCcw className="h-3 w-3" />
                        <span>Toggle Status</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}