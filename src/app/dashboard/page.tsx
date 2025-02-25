'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { getSummaryData } from '@/lib/dataUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeChange: 0,
    expenseChange: 0
  });
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  
  useEffect(() => {
    // טעינת נתונים מאחסון מקומי
    const data = getSummaryData();
    setSummaryData(data.summary);
    setMonthlyData(data.monthly);
    setCategoryData(data.categories);
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">לוח בקרה פיננסי</h1>
        <p className="text-gray-500">מבט כללי על הפעילות הפיננסית</p>
      </div>
      
      {/* כרטיסי סיכום */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">סה״כ הכנסות</h3>
            <Wallet className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">₪{summaryData.totalIncome.toLocaleString()}</div>
            <p className={`text-xs ${summaryData.incomeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {summaryData.incomeChange >= 0 ? '+' : ''}{summaryData.incomeChange}% מהחודש שעבר
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-r-4 border-red-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">סה״כ הוצאות</h3>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">₪{summaryData.totalExpenses.toLocaleString()}</div>
            <p className={`text-xs ${summaryData.expenseChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {summaryData.expenseChange >= 0 ? '+' : ''}{summaryData.expenseChange}% מהחודש שעבר
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">מאזן</h3>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">₪{summaryData.balance.toLocaleString()}</div>
            <p className={`text-xs ${summaryData.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {summaryData.balance >= 0 ? 'חיובי' : 'שלילי'}
            </p>
          </div>
        </div>
      </div>
      
      {/* גרפים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 text-gray-700">הכנסות והוצאות חודשיות</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₪${value}`} />
                <Legend />
                <Line type="monotone" dataKey="הכנסות" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="הוצאות" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 text-gray-700">התפלגות הוצאות לפי קטגוריה</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₪${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}