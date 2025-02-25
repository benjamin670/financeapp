export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

// שמירת נתונים במאחסון מקומי
export const saveTransactions = (transactions: Transaction[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
};

// קבלת נתונים מאחסון מקומי
export const getLocalData = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('transactions');
    if (data) {
      return JSON.parse(data);
    }
  }
  
  // נתוני דוגמה
  const demoData: Transaction[] = [
    { id: '1', type: 'income', amount: 15000, date: '2023-01-15', category: 'שכר', description: 'משכורת ינואר' },
    { id: '2', type: 'income', amount: 15000, date: '2023-02-15', category: 'שכר', description: 'משכורת פברואר' },
    { id: '3', type: 'income', amount: 15500, date: '2023-03-15', category: 'שכר', description: 'משכורת מרץ' },
    { id: '4', type: 'income', amount: 15500, date: '2023-04-15', category: 'שכר', description: 'משכורת אפריל' },
    { id: '5', type: 'expense', amount: 3500, date: '2023-01-05', category: 'דיור', description: 'שכר דירה ינואר' },
    { id: '6', type: 'expense', amount: 3500, date: '2023-02-05', category: 'דיור', description: 'שכר דירה פברואר' },
    { id: '7', type: 'expense', amount: 3500, date: '2023-03-05', category: 'דיור', description: 'שכר דירה מרץ' },
    { id: '8', type: 'expense', amount: 3500, date: '2023-04-05', category: 'דיור', description: 'שכר דירה אפריל' },
    { id: '9', type: 'expense', amount: 1500, date: '2023-01-10', category: 'מזון', description: 'קניות סופר ינואר' },
    { id: '10', type: 'expense', amount: 1800, date: '2023-02-10', category: 'מזון', description: 'קניות סופר פברואר' },
    { id: '11', type: 'expense', amount: 1600, date: '2023-03-10', category: 'מזון', description: 'קניות סופר מרץ' },
    { id: '12', type: 'expense', amount: 1700, date: '2023-04-10', category: 'מזון', description: 'קניות סופר אפריל' },
  ];
  
  saveTransactions(demoData);
  return demoData;
};

// פונקציה לחישוב נתוני סיכום
export const getSummaryData = () => {
  const transactions = getLocalData();
  
  // חישוב הכנסות והוצאות
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // חישוב שינוי מהחודש הקודם
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth - 1 >= 0 ? currentMonth - 1 : 11;
  
  const currentMonthIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const lastMonthIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === lastMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const lastMonthExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const incomeChange = lastMonthIncome > 0 
    ? Math.round(((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100) 
    : 0;
    
  const expenseChange = lastMonthExpenses > 0 
    ? Math.round(((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100) 
    : 0;
  
  // נתונים חודשיים
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  
  const monthlyData = months.map((month, index) => {
    const monthIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === index)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === index)
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      month,
      הכנסות: monthIncome,
      הוצאות: monthExpenses
    };
  });
  
  // התפלגות קטגוריות הוצאות
  const categories: {[key: string]: number} = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += t.amount;
    });
  
  const categoryData = Object.keys(categories).map(name => ({
    name,
    value: categories[name]
  }));
  
  return {
    summary: {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeChange,
      expenseChange
    },
    monthly: monthlyData,
    categories: categoryData
  };
};