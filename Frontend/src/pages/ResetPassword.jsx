import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message || 'Password reset failed. The link may have expired.');
    }
  };

  return (
    <div className="container min-h-screen pt-20 pb-16 flex flex-col items-center justify-center relative">
      <div className="blob top-1/2 right-1/4 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-[520px] shadow-2xl relative z-10 border border-border/60"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-black mb-4">Password Reset!</h2>
              <p className="text-muted font-medium mb-8">
                Your password has been updated. Redirecting to login...
              </p>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-secondary/30">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3">RESET PASSWORD</h2>
                <p className="text-muted font-medium">Create a new secure password</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold flex items-start gap-3"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}

              {!token && (
                <div className="text-center mt-4">
                  <Link to="/forgot-password" className="btn btn-primary px-8 py-4 rounded-2xl">
                    Request New Reset Link
                  </Link>
                </div>
              )}

              {token && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* New Password */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-muted uppercase tracking-widest pl-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
                      <input
                        type={showNew ? 'text' : 'password'}
                        id="reset-new-password"
                        className="modern-input pl-14 pr-14"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      >
                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {newPassword && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center mt-1">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="h-1.5 flex-1 rounded-full transition-all duration-300"
                              style={{ backgroundColor: i <= strength ? strengthColor[strength] : 'var(--border)' }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold" style={{ color: strengthColor[strength] }}>
                          {strengthLabel[strength]}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-muted uppercase tracking-widest pl-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        id="reset-confirm-password"
                        className="modern-input pl-14 pr-14"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-xs font-bold pl-1 ${
                          newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !!error}
                    className="btn btn-primary w-full py-5 text-lg rounded-2xl mt-2 justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <ShieldCheck size={20} />
                        Reset Password
                      </span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
