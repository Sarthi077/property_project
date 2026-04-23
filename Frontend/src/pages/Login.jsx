import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container min-h-screen pt-20 pb-16 flex flex-col items-center justify-center relative">
      <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-[520px] shadow-2xl relative z-10 border border-border/60"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-xl shadow-primary/30">
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">WELCOME BACK</h2>
          <p className="text-muted font-medium">Sign in to continue your property journey</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-sm font-bold text-muted uppercase tracking-widest pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                id="login-email"
                type="email"
                className="modern-input pl-14 pr-4"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pl-1">
              <label htmlFor="login-password" className="text-sm font-bold text-muted uppercase tracking-widest">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary font-bold hover:underline underline-offset-4"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="modern-input pl-14 pr-14"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            className="btn btn-primary w-full py-5 text-lg rounded-2xl mt-4 justify-center disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Log In <ChevronRight size={22} />
              </span>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-muted font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
