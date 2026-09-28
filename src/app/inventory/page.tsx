'use client';
import { useState, useEffect } from 'react';
import { Package, Trash2 } from 'lucide-react';
import PDFDownload from '@/components/PDFDownload';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [extraCost, setExtraCost] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('smart_inventory') || '[]');
    setInventory(saved);
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      extraCost: Number(extraCost || 0),
      date: new Date().toLocaleDateString(),
    };
    const updated = [...inventory, newProduct];
    localStorage.setItem('smart_inventory', JSON.stringify(updated));
    setInventory(updated);

    const auditLogs = JSON.parse(localStorage.getItem('smart_audit') || '[]');
    auditLogs.push({
      id: Date.now().toString(),
      user: localStorage.getItem('smart_active_user') || 'Admin',
      action: `Added product: ${name} (${quantity} pcs)`,
      time: new Date().toLocaleString(),
    });
    localStorage.setItem('smart_audit', JSON.stringify(auditLogs));

    setName('');
    setQuantity('');
    setBuyPrice('');
    setExtraCost('');
  };

  const handleDelete = (id: string) => {
    const updated = inventory.filter((item) => item.id !== id);
    localStorage.setItem('smart_inventory', JSON.stringify(updated));
    setInventory(updated);
  };

  const pdfHeaders = ['Product Name', 'Quantity', 'Buy Price (৳)', 'Extra Cost (৳)'];
  const pdfData = inventory.map((i) => ({ name: i.name, qty: `${i.quantity} Pcs`, price: i.buyPrice, extra: i.extraCost }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Stock Management</h1>
              <p className="text-xs text-gray-500">Add products with cost details</p>
            </div>
          </div>
          <PDFDownload title="Inventory Stock Report" headers={pdfHeaders} data={pdfData} filename="inventory_stock" />
        </div>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Quantity</label>
            <input
              type="number"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Pcs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Buy Price (৳)</label>
            <input
              type="number"
              required
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="Unit Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Extra Cost (৳)</label>
            <input
              type="number"
              value={extraCost}
              onChange={(e) => setExtraCost(e.target.value)}
              placeholder="Shipping etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Current Stock Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Buy Price</th>
                <th className="px-4 py-3">Extra Cost</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-400 text-xs">No products found.</td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">{item.quantity} Pcs</td>
                    <td className="px-4 py-3 text-gray-700">৳ {item.buyPrice}</td>
                    <td className="px-4 py-3 text-gray-700">৳ {item.extraCost}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="h-4 w-4" />
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