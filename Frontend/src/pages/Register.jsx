import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPass: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    if (result.success) {
      alert('Network Entry Successful! Please verify via email.');
      navigate('/login');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="container min-h-screen pt-20 pb-16 flex flex-col items-center justify-center relative">
      <div className="blob top-[10%] left-[20%]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-[560px] shadow-2xl relative z-10 border border-border/60"
      >
        <div className="text-center mb-10 md:mb-12">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-12 shadow-xl shadow-secondary/30 shrink-0">
            <UserPlus size={32} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">NEW NODE</h2>
          <p className="text-muted font-medium">Initialize your profile in the Rentera network</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 text-sm font-bold"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-muted uppercase tracking-[0.2em] pl-1">Legal Name</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="userName"
                type="text" 
                className="modern-input pl-14 pr-4"
                placeholder="Citizen Name"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-muted uppercase tracking-[0.2em] pl-1">Network Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="userEmail"
                type="email" 
                className="modern-input pl-14 pr-4"
                placeholder="email@network.com"
                value={formData.userEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-muted uppercase tracking-[0.2em] pl-1">Security Pass</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="userPass"
                type="password" 
                className="modern-input pl-14 pr-4"
                placeholder="••••••••"
                value={formData.userPass}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full py-5 text-lg md:text-xl rounded-2xl mt-6 shadow-xl shadow-primary/30 justify-center"
          >
            {loading ? 'Initializing...' : (
              <div className="flex items-center gap-2 justify-center">
                <span>Join Network</span>
                <ChevronRight size={24} />
              </div>
            )}
          </button>
        </form>

        <p className="text-center mt-12 text-muted font-medium">
          Already verified? {' '}
          <Link to="/login" className="text-secondary font-black hover:underline underline-offset-4">Identity Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
