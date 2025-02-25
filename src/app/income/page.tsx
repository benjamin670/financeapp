'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, getLocalData } from '@/lib/dataUtils';

export default function IncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const storedTransactions: Transaction[] = getLocalData();
    setTransactions(storedTransactions.filter((t: Transaction) => t.type === 'income'));
  }, []);

  const addTransaction = () => {
    setIsFormOpen(true);
    setEditingTransaction(null);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'type'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      type: 'income'
    };

    const storedTransactions: Transaction[] = getLocalData();
    const updatedTransactions = [...storedTransactions, newTransaction];
    
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    setIsFormOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleUpdateTransaction = (updatedTransaction: Omit<Transaction, 'id' | 'type'>) => {
    const storedTransactions: Transaction[] = getLocalData();
    
    const updatedTransactions = storedTransactions.map((t: Transaction) => 
      t.id === editingTransaction?.id 
        ? { ...updatedTransaction, id: editingTransaction.id, type: 'income' } 
        : t
    );
    
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions.filter((t: Transaction) => t.type === 'income'));
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק עסקה זו?')) {
      const storedTransactions: Transaction[] = getLocalData();
      const updatedTransactions = storedTransactions.filter((t: Transaction) => t.id !== id);
      
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions.filter((t: Transaction) => t.type === 'income'));
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">ניהול הכנסות</h1>
          <button
            onClick={addTransaction}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            הוסף הכנסה
          </button>
        </div>

        {isFormOpen ? (
          <div className="mb-6">
            <TransactionForm
              type="income"
              onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTransaction(null);
              }}
              initialData={editingTransaction}
            />
          </div>
        ) : null}

        <div className="bg-white rounded-lg shadow-md">
          <TransactionTable
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </Layout>
  );
}