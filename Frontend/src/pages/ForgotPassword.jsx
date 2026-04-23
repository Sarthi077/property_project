import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="container min-h-screen pt-20 pb-16 flex flex-col items-center justify-center relative">
      <div className="blob top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-[520px] shadow-2xl relative z-10 border border-border/60"
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-black mb-4">Check Your Inbox</h2>
              <p className="text-muted font-medium mb-2">
                If an account with <span className="text-foreground font-bold">{email}</span> exists,
                we've sent a password reset link.
              </p>
              <p className="text-sm text-muted mb-10">The link expires in 1 hour.</p>
              <Link
                to="/login"
                className="btn btn-primary w-full justify-center py-4 rounded-2xl text-lg"
              >
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
                  <KeyRound size={32} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3">FORGOT PASSWORD</h2>
                <p className="text-muted font-medium">Enter your email to receive a reset link</p>
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-muted uppercase tracking-widest pl-1">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
                    <input
                      type="email"
                      id="forgot-email"
                      className="modern-input pl-14 pr-4"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-5 text-lg rounded-2xl mt-2 justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Send size={20} />
                      Send Reset Link
                    </span>
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 mt-10 text-muted font-bold hover:text-primary transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
