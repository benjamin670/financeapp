'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    // בדיקת התחברות
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  // רוחב מסך קטן - סגירת הסרגל
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/dashboard', name: 'לוח בקרה', icon: <Home size={20} /> },
    { path: '/income', name: 'הכנסות', icon: <TrendingUp size={20} /> },
    { path: '/expenses', name: 'הוצאות', icon: <TrendingDown size={20} /> },
  ];

  if (pathname === '/login') return children;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" dir="rtl">
      {/* מוביל */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* סרגל צדדי */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } fixed md:static top-0 right-0 h-full bg-blue-800 text-white w-64 transition-transform duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold text-center">VIP Clean Holdings</h2>
          <p className="text-blue-300 text-xs text-center mt-1">מערכת ניהול פיננסית</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <a 
                  href={item.path}
                  className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition duration-200 ${
                    pathname === item.path ? 'bg-blue-700' : ''
                  }`}
                >
                  <span className="ml-2">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-blue-300 hover:text-white w-full p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            <LogOut size={20} className="ml-2" />
            <span>התנתק</span>
          </button>
        </div>
      </div>
      
      {/* תוכן ראשי */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}