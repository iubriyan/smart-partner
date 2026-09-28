'use client';
import { useState, useEffect } from 'react';
import { Users, PieChart } from 'lucide-react';
import PDFDownload from '@/components/PDFDownload';

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');
  const [amount, setAmount] = useState('');
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('smart_investors') || '[]');
    setInvestors(saved);

    const orders = JSON.parse(localStorage.getItem('smart_orders') || '[]');
    const profit = orders.reduce((sum: number, o: any) => sum + Number(o.profit), 0);
    setTotalProfit(profit);
  }, []);

  const uniqueNames = Array.from(new Set(investors.map((i) => i.name)));

  const handleAddInvest = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = selectedName === 'NEW' ? customName.trim() : selectedName;
    if (!finalName) return;

    const newEntry = {
      id: Date.now().toString(),
      name: finalName,
      amount: Number(amount),
      date: new Date().toLocaleDateString(),
    };
    const updated = [...investors, newEntry];
    localStorage.setItem('smart_investors', JSON.stringify(updated));
    setInvestors(updated);

    const auditLogs = JSON.parse(localStorage.getItem('smart_audit') || '[]');
    auditLogs.push({
      id: Date.now().toString(),
      user: localStorage.getItem('smart_active_user') || 'Admin',
      action: `Added ৳${amount} investment for ${finalName}`,
      time: new Date().toLocaleString(),
    });
    localStorage.setItem('smart_audit', JSON.stringify(auditLogs));

    setSelectedName('');
    setCustomName('');
    setAmount('');
  };

  const aggregatedInvestors = investors.reduce((acc: any, curr: any) => {
    if (!acc[curr.name]) acc[curr.name] = 0;
    acc[curr.name] += Number(curr.amount);
    return acc;
  }, {});

  const totalInvestAll = Object.values(aggregatedInvestors).reduce((a: any, b: any) => a + b, 0) as number;

  const pdfHeaders = ['Investor Name', 'Total Invested (৳)', 'Share Percentage', 'Profit Share (৳)'];
  const pdfData = Object.entries(aggregatedInvestors).map(([invName, invAmount]: [string, any]) => {
    const percentage = totalInvestAll > 0 ? ((invAmount / totalInvestAll) * 100).toFixed(2) + '%' : '0%';
    const profitShare = totalInvestAll > 0 ? (totalProfit * (invAmount / totalInvestAll)).toFixed(2) : '0';
    return { name: invName, amount: invAmount, percentage, profit: `৳ ${profitShare}` };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-slate-50 min-h-screen py-6 px-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Investor Management & Share</h1>
              <p className="text-xs text-gray-500">Select existing investor or add new profile</p>
            </div>
          </div>
          <PDFDownload title="Investor Profit Share Report" headers={pdfHeaders} data={pdfData} filename="investors_report" />
        </div>

        <form onSubmit={handleAddInvest} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Investor</label>
            <select
              required
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              <option value="">Choose Investor</option>
              <option value="NEW">+ Add New Investor</option>
              {uniqueNames.map((n: any, idx) => (
                <option key={idx} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {selectedName === 'NEW' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">New Investor Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Investment Amount (৳)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>

          <div className="flex items-end sm:col-span-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition"
            >
              Add Investment / Update ID
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <PieChart className="h-5 w-5 text-indigo-600" />
          <span>Profit Share Breakdown</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-gray-700">Investor Name</th>
                <th className="px-4 py-3 text-gray-700">Total Invested</th>
                <th className="px-4 py-3 text-gray-700">Share Percentage</th>
                <th className="px-4 py-3 text-gray-700">Estimated Profit Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.keys(aggregatedInvestors).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-400 text-xs">No records found.</td>
                </tr>
              ) : (
                Object.entries(aggregatedInvestors).map(([invName, invAmount]: [string, any], index) => {
                  const percentage = totalInvestAll > 0 ? ((invAmount / totalInvestAll) * 100).toFixed(2) : '0';
                  const profitShare = totalInvestAll > 0 ? (totalProfit * (invAmount / totalInvestAll)).toFixed(2) : '0';
                  return (
                    <tr key={index}>
                      <td className="px-4 py-3 font-medium text-gray-900">{invName}</td>
                      <td className="px-4 py-3 text-gray-700">৳ {invAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-indigo-600 font-semibold">{percentage}%</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">৳ {Number(profitShare).toLocaleString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}