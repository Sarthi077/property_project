import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import {
  User, Mail, Shield, Plus, Trash2, Edit, LayoutDashboard, Database,
  LogOut, X, Lock, AlertCircle, CheckCircle2, Eye, EyeOff,
  Building2, ImageOff, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const {
    user, token, logout,
    editUserProfile, deleteUserProfile, changePassword,
    listMyProperties, updateProperty, deleteProperty
  } = useAuth();
  const navigate = useNavigate();

  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);     // property obj
  const [deletingPropertyId, setDeletingPropertyId] = useState(null); // p_id

  // Form states
  const [editForm, setEditForm] = useState({ userName: user?.user_name || '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Property edit form
  const [propForm, setPropForm] = useState({});
  const [originalPropForm, setOriginalPropForm] = useState({});
  const [propImages, setPropImages] = useState([]);

  // True when user has changed at least one field or picked new images
  const hasPropertyChanges = propImages.length > 0 ||
    JSON.stringify(propForm) !== JSON.stringify(originalPropForm);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ── Fetch my properties ────────────────────────────────────────────
  const fetchMyProperties = async () => {
    setLoading(true);
    const result = await listMyProperties();
    if (result.success) setMyProperties(result.properties);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchMyProperties();
  }, [token]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // ── Profile edit ──────────────────────────────────────────────────
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await editUserProfile({ userName: editForm.userName });
    setSaving(false);
    if (result.success) {
      showMsg('success', 'Profile updated successfully!');
      setShowEditModal(false);
    } else {
      showMsg('error', result.message);
    }
  };

  // ── Change password ───────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMsg('error', 'New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showMsg('error', 'New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    const result = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    setSaving(false);
    if (result.success) {
      showMsg('success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      showMsg('error', result.message);
    }
  };

  // ── Delete account ────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setSaving(true);
    const result = await deleteUserProfile();
    setSaving(false);
    if (result.success) {
      showMsg('success', 'Account deleted. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } else {
      showMsg('error', result.message);
    }
  };

  // ── Property edit ─────────────────────────────────────────────────
  const openPropertyEdit = (property) => {
    setEditingProperty(property);
    const initial = {
      name:        property.name        ?? '',
      description: property.description ?? '',
      city:        property.city        ?? '',
      country:     property.country     ?? '',
      rent:        property.rent        != null ? String(property.rent)    : '',
      amount:      property.amount      != null ? String(property.amount)  : '',
      bedRooms:    property.bedRooms    != null ? String(property.bedRooms): '',
    };
    setPropForm(initial);
    setOriginalPropForm(initial);  // snapshot for dirty detection
    setPropImages([]);
  };

  const handlePropertyEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    Object.entries(propForm).forEach(([k, v]) => fd.append(k, v));
    propImages.forEach(img => fd.append('images', img));

    const result = await updateProperty(editingProperty.p_id, fd);
    setSaving(false);
    if (result.success) {
      showMsg('success', 'Property updated!');
      setEditingProperty(null);
      fetchMyProperties();
    } else {
      showMsg('error', result.message);
    }
  };

  // ── Property delete ───────────────────────────────────────────────
  const handlePropertyDelete = async () => {
    if (!deletingPropertyId) return;
    setSaving(true);
    const result = await deleteProperty(deletingPropertyId);
    setSaving(false);
    setDeletingPropertyId(null);
    if (result.success) {
      setMyProperties(prev => prev.filter(p => p.p_id !== deletingPropertyId));
      showMsg('success', 'Property removed successfully!');
    } else {
      showMsg('error', result.message);
    }
  };

  if (!user) return null;

  const ModalOverlay = ({ children, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="container py-20 animate-fade-in relative">
      <div className="blob top-0 left-0" />

      {/* Toast Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-[300] flex items-center gap-3 p-4 pr-6 rounded-2xl border shadow-2xl max-w-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success'
              ? <CheckCircle2 size={20} />
              : <AlertCircle size={20} />
            }
            <span className="font-bold text-sm">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 relative z-10">

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2.5rem] sticky top-28 border border-border shadow-2xl">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center text-white mb-4 text-4xl font-black rotate-3 shadow-xl shadow-primary/30">
                {user.user_name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">{user.user_name}</h2>
              <div className="px-4 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold border border-secondary/20">
                ACTIVE ACCOUNT
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-bold text-muted">
                <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <span className="truncate">{user.user_email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-muted">
                <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center shrink-0">
                  <Shield size={16} />
                </div>
                <span>{user.is_verify === 1 ? '✓ Email Verified' : '⚠ Email Pending'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-muted">
                <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center shrink-0">
                  <Building2 size={16} />
                </div>
                <span>{myProperties.length} Active Listing{myProperties.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setEditForm({ userName: user.user_name || '' }); setShowEditModal(true); }}
                className="btn btn-ghost w-full justify-start py-3.5 border-border hover:bg-primary/10 hover:text-primary text-sm"
              >
                <Edit size={18} /> Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn w-full justify-start py-3.5 bg-blue-500/10 text-blue-400 border-none hover:bg-blue-500 hover:text-white text-sm"
              >
                <Lock size={18} /> Change Password
              </button>
              <button
                onClick={logout}
                className="btn w-full justify-start py-3.5 bg-amber-500/10 text-amber-400 border-none hover:bg-amber-500 hover:text-white text-sm"
              >
                <LogOut size={18} /> Logout
              </button>
              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="btn w-full justify-start py-3.5 bg-red-900/20 text-red-400 border-none hover:bg-red-900 hover:text-red-200 text-sm"
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* ── My Properties ───────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Database size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">My Properties</h2>
                <p className="text-muted text-sm font-medium">{myProperties.length} listing{myProperties.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button className="btn btn-primary px-6 rounded-2xl" onClick={() => navigate('/add-property')}>
              <Plus size={18} /> Add New
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="modern-card h-[400px] animate-pulse bg-surface-alt/50" />
              ))}
            </div>
          ) : myProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProperties.map(property => (
                <PropertyCard
                  key={property.p_id}
                  property={property}
                  showActions
                  onEdit={(e) => { e?.stopPropagation(); openPropertyEdit(property); }}
                  onDelete={(e) => { e?.stopPropagation(); setDeletingPropertyId(property.p_id); }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-16 rounded-[3rem] text-center border-dashed border-2 border-border"
            >
              <LayoutDashboard size={56} className="mx-auto text-muted mb-6 opacity-30" />
              <p className="text-xl font-black mb-3 text-muted uppercase">No properties yet</p>
              <p className="text-muted text-sm mb-8">List your first property and start earning!</p>
              <button
                className="btn btn-primary px-10 py-4 text-base rounded-2xl"
                onClick={() => navigate('/add-property')}
              >
                <Plus size={18} /> List First Property
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <ModalOverlay onClose={() => setShowEditModal(false)}>
            <div className="modern-card p-8 rounded-3xl border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black">Edit Profile</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-surface-alt rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditProfile} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-muted uppercase tracking-wider">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="text"
                      value={editForm.userName}
                      onChange={(e) => setEditForm({ userName: e.target.value })}
                      className="modern-input pl-12"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 btn btn-ghost">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn btn-primary disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <ModalOverlay onClose={() => setShowPasswordModal(false)}>
            <div className="modern-card p-8 rounded-3xl border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-surface-alt rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                {[
                  { label: 'Current Password', key: 'oldPassword', show: showOld, toggle: () => setShowOld(v => !v) },
                  { label: 'New Password', key: 'newPassword', show: showNew, toggle: () => setShowNew(v => !v) },
                  { label: 'Confirm New Password', key: 'confirmPassword', show: showNew, toggle: () => setShowNew(v => !v) },
                ].map(({ label, key, show, toggle }) => (
                  <div key={key}>
                    <label className="block text-sm font-bold mb-2 text-muted uppercase tracking-wider">{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                      <input
                        type={show ? 'text' : 'password'}
                        value={passwordForm[key]}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                        className="modern-input pl-11 pr-11"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 btn btn-ghost">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn btn-primary disabled:opacity-50">
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteAccountModal && (
          <ModalOverlay onClose={() => setShowDeleteAccountModal(false)}>
            <div className="modern-card p-8 rounded-3xl border border-red-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle size={24} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-red-400 mb-1">Delete Account?</h3>
                  <p className="text-muted text-sm">This action cannot be undone. All your listings and data will be removed.</p>
                </div>
                <button onClick={() => setShowDeleteAccountModal(false)} className="p-1 hover:bg-surface-alt rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteAccountModal(false)} className="flex-1 btn btn-ghost" disabled={saving}>
                  Keep Account
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="flex-1 btn bg-red-500/20 text-red-400 border-none hover:bg-red-600 hover:text-white disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Edit Property Modal */}
      <AnimatePresence>
        {editingProperty && (
          <ModalOverlay onClose={() => setEditingProperty(null)}>
            <div className="modern-card p-8 rounded-3xl border border-border max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black">Edit Property</h3>
                <button onClick={() => setEditingProperty(null)} className="p-2 hover:bg-surface-alt rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handlePropertyEdit} className="flex flex-col gap-4">
                {[
                  { label: 'Property Name', key: 'name', type: 'text', placeholder: 'The Zenith Heights' },
                  { label: 'City', key: 'city', type: 'text', placeholder: 'Mumbai' },
                  { label: 'Country', key: 'country', type: 'text', placeholder: 'India' },
                  { label: 'Monthly Rent (₹)', key: 'rent', type: 'number', placeholder: '25000' },
                  { label: 'Security Deposit (₹)', key: 'amount', type: 'number', placeholder: '50000' },
                  { label: 'Bedrooms', key: 'bedRooms', type: 'number', placeholder: '2' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold mb-2 text-muted uppercase tracking-wider">{label}</label>
                    <input
                      type={type}
                      value={propForm[key] || ''}
                      onChange={(e) => setPropForm({ ...propForm, [key]: e.target.value })}
                      className="modern-input"
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold mb-2 text-muted uppercase tracking-wider">Description</label>
                  <textarea
                    value={propForm.description || ''}
                    onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                    className="modern-input min-h-[100px] resize-none"
                    placeholder="Describe the property..."
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-muted uppercase tracking-wider">
                    Update Images (optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center relative hover:border-primary transition-colors bg-surface-alt/20">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setPropImages([...e.target.files])}
                    />
                    <Upload size={24} className="mx-auto text-muted mb-2" />
                    <p className="text-sm font-bold text-muted">
                      {propImages.length > 0 ? `${propImages.length} file(s) selected` : 'Click to upload new images'}
                    </p>
                    <p className="text-xs text-muted/70 mt-1">This will replace existing images</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditingProperty(null)} className="flex-1 btn btn-ghost">Cancel</button>
                  <button
                    type="submit"
                    disabled={saving || !hasPropertyChanges}
                    className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? 'Updating...'
                      : hasPropertyChanges
                        ? 'Update Property'
                        : 'No Changes Yet'}
                  </button>
                </div>
              </form>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Delete Property Confirm Modal */}
      <AnimatePresence>
        {deletingPropertyId && (
          <ModalOverlay onClose={() => setDeletingPropertyId(null)}>
            <div className="modern-card p-8 rounded-3xl border border-red-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                  <Trash2 size={24} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-red-400 mb-1">Remove Property?</h3>
                  <p className="text-muted text-sm">This listing will be deactivated and removed from public view.</p>
                </div>
                <button onClick={() => setDeletingPropertyId(null)} className="p-1 hover:bg-surface-alt rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeletingPropertyId(null)} className="flex-1 btn btn-ghost" disabled={saving}>
                  Cancel
                </button>
                <button
                  onClick={handlePropertyDelete}
                  disabled={saving}
                  className="flex-1 btn bg-red-500/20 text-red-400 border-none hover:bg-red-600 hover:text-white disabled:opacity-50"
                >
                  {saving ? 'Removing...' : 'Yes, Remove'}
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
