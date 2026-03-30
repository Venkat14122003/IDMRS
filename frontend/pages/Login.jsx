import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
      setToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', margin: '0 auto 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)' }}>
            <LogIn color="white" size={28} />
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Login to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
          
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input required className="input-field" style={{ paddingLeft: '44px' }} type="email" placeholder="name@company.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input required className="input-field" style={{ paddingLeft: '44px' }} type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign in'}
            {!loading && <LogIn size={18} />}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" className="nav-link" style={{ fontWeight: 600 }}>Create account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
