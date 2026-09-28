'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, ShoppingCart, ArrowDownRight, Package, Truck, RefreshCw, Layers } from 'lucide-react';
import PDFDownload from '@/components/PDFDownload';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInvest: 0,
    totalExpense: 0,
    totalProfit: 0,
    currentBalance: 0,
    totalStockItems: 0,
    totalStockQty: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    totalSalesAmount: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const activeUser = localStorage.getItem('smart_active_user');
    if (!activeUser) {
      router.push('/login');
      return;
    }

    const investors = JSON.parse(localStorage.getItem('smart_investors') || '[]');
    const inventory = JSON.parse(localStorage.getItem('smart_inventory') || '[]');
    const orders = JSON.parse(localStorage.getItem('smart_orders') || '[]');

    // Calculations
    const totalInvest = investors.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
    const totalExpense = inventory.reduce((sum: number, item: any) => sum + (Number(item.buyPrice) + Number(item.extraCost)) * Number(item.quantity), 0);
    const totalProfit = orders.reduce((sum: number, item: any) => sum + (item.status === 'Delivered' ? Number(item.profit) : 0), 0);
    const currentBalance = totalInvest + totalProfit - totalExpense;

    // Stock stats
    const totalStockItems = inventory.length;
    const totalStockQty = inventory.reduce((sum: number, item: any) => sum + Number(item.quantity), 0);

    // Order stats
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o: any) => o.status === 'Delivered').length;
    const returnedOrders = orders.filter((o: any) => o.status === 'Returned').length;
    const totalSalesAmount = orders.reduce((sum: number, item: any) => sum + (item.status === 'Delivered' ? Number(item.sellPrice) : 0), 0);

    setStats({
      totalInvest,
      totalExpense,
      totalProfit,
      currentBalance,
      totalStockItems,
      totalStockQty,
      totalOrders,
      deliveredOrders,
      returnedOrders,
      totalSalesAmount,
    });

    setRecentOrders(orders.slice(-5).reverse()); // Last 5 orders
  }, [router]);

  const pdfHeaders = ['Business Metric', 'Value / Amount'];
  const pdfData = [
    { metric: 'Current Balance', value: `৳ ${stats.currentBalance}` },
    { metric: 'Total Invested', value: `৳ ${stats.totalInvest}` },
    { metric: 'Total Expenses', value: `৳ ${stats.totalExpense}` },
    { metric: 'Total Net Profit', value: `৳ ${stats.totalProfit}` },
    { metric: 'Total Sales Revenue', value: `৳ ${stats.totalSalesAmount}` },
    { metric: 'Stock Product Types', value: `${stats.totalStockItems} Items` },
    { metric: 'Total Stock Quantity', value: `${stats.totalStockQty} Pcs` },
    { metric: 'Total Orders Placed', value: `${stats.totalOrders} Orders` },
    { metric: 'Successfully Delivered', value: `${stats.deliveredOrders} Orders` },
    { metric: 'Returned Orders', value: `${stats.returnedOrders} Orders` },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SmartPartner - Business Dashboard</h1>
          <p className="text-sm text-gray-500">Comprehensive real-time overview of finance, inventory, and orders</p>
        </div>
        <PDFDownload title="Complete Business Executive Summary" headers={pdfHeaders} data={pdfData} filename="executive_business_summary" />
      </div>

      {/* Main Financial Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Balance</p>
            <h3 className={`text-2xl font-bold mt-1 ${stats.currentBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              ৳ {stats.currentBalance.toLocaleString()}
            </h3>
            <span className="text-[10px] text-gray-400">Goes minus if expenses exceed</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Invested</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">৳ {stats.totalInvest.toLocaleString()}</h3>
            <span className="text-[10px] text-gray-400">Combined investor funds</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">৳ {stats.totalExpense.toLocaleString()}</h3>
            <span className="text-[10px] text-gray-400">Stock & procurement costs</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <ArrowDownRight className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Net Profit</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">৳ {stats.totalProfit.toLocaleString()}</h3>
            <span className="text-[10px] text-gray-400">From delivered sales</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingCart className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Secondary Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Sales Revenue</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">৳ {stats.totalSalesAmount.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Stock Items</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{stats.totalStockQty} Pcs <span className="text-xs font-normal text-gray-400">({stats.totalStockItems} types)</span></h3>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Delivered Orders</p>
            <h3 className="text-xl font-bold text-green-600 mt-1">{stats.deliveredOrders} <span className="text-xs font-normal text-gray-400">/ {stats.totalOrders} total</span></h3>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Truck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Returned Orders</p>
            <h3 className="text-xl font-bold text-red-600 mt-1">{stats.returnedOrders} Orders</h3>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Preview Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Customer Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Sell Price</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-400 text-xs">No recent orders found.</td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{ord.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{ord.mobile}</td>
                    <td className="px-4 py-3 text-gray-800">{ord.productName}</td>
                    <td className="px-4 py-3 text-gray-600">{ord.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">৳ {ord.sellPrice}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ord.status === 'Returned' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {ord.status}
                      </span>
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