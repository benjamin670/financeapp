'use client';

import React, { useState } from 'react';
import { Transaction } from '@/lib/dataUtils';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSubmit: (data: Omit<Transaction, 'id' | 'type'>) => void;
  onCancel: () => void;
  initialData?: Transaction;
}

export default function TransactionForm({ type, onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount.toString() || '',
    date: initialData?.date || new Date().toISOString().slice(0, 10),
    category: initialData?.category || '',
    description: initialData?.description || '',
  });

  const commonCategories = type === 'income' 
    ? ['שכר', 'הכנסה פסיבית', 'השקעות', 'מענקים', 'אחר'] 
    : ['דיור', 'מזון', 'תחבורה', 'חשבונות', 'בידור', 'ביגוד', 'בריאות', 'חינוך', 'אחר'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: Number(formData.amount),
      date: formData.date,
      category: formData.category,
      description: formData.description,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'עריכת' : 'הוספת'} {type === 'income' ? 'הכנסה' : 'הוצאה'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">סכום</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">בחר קטגוריה</option>
            {commonCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            ביטול
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {initialData ? 'עדכן' : 'הוסף'}
          </button>
        </div>
      </form>
    </div>
  );
}