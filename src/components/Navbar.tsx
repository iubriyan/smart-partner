'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, UserCheck, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const active = localStorage.getItem('smart_active_user');
    setCurrentUser(active);

    // If not logged in and not on login page, force redirect to login
    if (!active && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('smart_active_user');
    setCurrentUser(null);
    router.push('/login');
  };

  if (pathname === '/login') return null;
  if (!currentUser) return null;

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-indigo-400" />
            <span className="font-bold text-xl tracking-wide">SmartPartner</span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={`${pathname === '/' ? 'text-indigo-400 font-bold' : 'text-gray-300'} hover:text-white`}>Dashboard</Link>
            <Link href="/investors" className={`${pathname === '/investors' ? 'text-indigo-400 font-bold' : 'text-gray-300'} hover:text-white`}>Investors</Link>
            <Link href="/inventory" className={`${pathname === '/inventory' ? 'text-indigo-400 font-bold' : 'text-gray-300'} hover:text-white`}>Inventory</Link>
            <Link href="/orders" className={`${pathname === '/orders' ? 'text-indigo-400 font-bold' : 'text-gray-300'} hover:text-white`}>Orders</Link>
            <Link href="/audit" className={`${pathname === '/audit' ? 'text-indigo-400 font-bold' : 'text-gray-300'} hover:text-white`}>Audit Logs</Link>
            <Link href="/members" className={`${pathname === '/members' ? 'text-indigo-400 font-bold' : 'text-gray-300'} hover:text-white`}>Add Member</Link>
            
            <div className="border-l border-gray-700 pl-4 flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <UserCheck className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-200">{currentUser}</span>
                <button onClick={handleLogout} title="Logout" className="text-red-400 hover:text-red-300 ml-2">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}