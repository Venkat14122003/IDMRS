import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart3, Plus, LogOut, Wallet, Calendar, 
  Trash2, Filter, Sparkles, ChevronDown, User as UserIcon, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ onLogout }) => {
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'FOOD', expenseDate: new Date().toISOString().split('T')[0] });
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, insRes] = await Promise.all([
        api.get('/expenses?size=10'),
        api.get('/insights')
      ]);
      setExpenses(expRes.data.content || []);
      setInsights(insRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', newExpense);
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/expenses/${id}`);
      fetchData();
    }
  };

  const categories = ['FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'SHOPPING', 'OTHER'];

  if (loading && expenses.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={48} className="animate-spin" color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'white' }}>
      {/* Navbar */}
      <nav style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
            <BarChart3 size={24} color="white"/>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>IDMRS</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <UserIcon size={18} />
            <span style={{ fontSize: '0.875rem' }}>{user.email}</span>
          </div>
          <button onClick={onLogout} className="btn" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--secondary)', padding: '0.5rem 1rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
          
          {/* Main Content */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Expenses</h2>
                <p style={{ color: 'var(--text-muted)' }}>Track and control your daily spending</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                <Plus size={18} />
                Add Receipt
              </button>
            </div>

            {/* Expense List */}
            <div className="glass-card" style={{ padding: '1rem', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontSize: '0.875rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <th style={{ padding: '1rem' }}>TRANSACTION</th>
                    <th style={{ padding: '1rem' }}>CATEGORY</th>
                    <th style={{ padding: '1rem' }}>DATE</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>AMOUNT</th>
                    <th style={{ padding: '1rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <motion.tr 
                      layout
                      key={exp.id} 
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{exp.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.description || 'No description'}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                          {exp.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{exp.expenseDate}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'white' }}>
                        ${exp.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button onClick={() => handleDelete(exp.id)} className="btn" style={{ padding: '0.4rem', color: '#64748b' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {expenses.length === 0 && (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No transactions found. Add your first expense!
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Insights Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card" 
              style={{ 
                padding: '1.5rem', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(16, 185, 129, 0.1))',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                <Sparkles size={80} color="var(--accent)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
                  <Sparkles size={20} color="#10b981" />
                </div>
                <h3 style={{ fontWeight: 700, color: '#10b981', fontSize: '1.1rem' }}>Smart Analysis</h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', position: 'relative', zIndex: 1 }}>
                {insights?.recommendation || "Analyzing your spending patterns to suggest improvements..."}
              </p>
              {insights?.topSpendingCategory && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Top Category</div>
                  <div style={{ fontWeight: 700, fontSize: '1.4rem', color: 'white' }}>{insights.topSpendingCategory}</div>
                </div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Wallet size={20} color="var(--primary)" />
                <h3 style={{ fontWeight: 700 }}>Summary</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> Total Balance
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${insights?.monthlyBudget?.toLocaleString() || '0'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Spend</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f43f5e' }}>${insights?.totalSpend?.toLocaleString() || '0'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Savings</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>${insights?.savings?.toLocaleString() || '0'}</div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.5rem' }}>
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(100, (insights?.totalSpend / insights?.monthlyBudget) * 100)}%` }}
                     style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                   />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>New Expense</h2>
              <form onSubmit={handleAddExpense}>
                <div className="input-group">
                  <label className="input-label">What for?</label>
                  <input required className="input-field" placeholder="e.g. Weekly Groceries" value={newExpense.title} onChange={(e) => setNewExpense({...newExpense, title: e.target.value})} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Amount ($)</label>
                    <input required type="number" step="0.01" className="input-field" placeholder="0.00" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input required type="date" className="input-field" value={newExpense.expenseDate} onChange={(e) => setNewExpense({...newExpense, expenseDate: e.target.value})} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="input-field" style={{ appearance: 'none' }} value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Save Transaction</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
