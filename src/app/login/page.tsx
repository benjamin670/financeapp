'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0585676722') {
      // שמירת מצב התחברות ב-localStorage
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      setError('סיסמה שגויה. נסה שנית.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">VIP Clean Holdings</h1>
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            VIP
          </div>
          <p className="text-gray-600 text-sm text-center">מערכת ניהול פיננסית</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-right">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dir-rtl"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
}