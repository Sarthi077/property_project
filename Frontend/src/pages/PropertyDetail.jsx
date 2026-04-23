import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Bed, IndianRupee, ArrowLeft, Home, Calendar, Shield,
  ChevronLeft, ChevronRight, Share2, Heart, Edit, X, Upload,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:4000';

const PropertyDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, updateProperty } = useAuth();

  // Keep property in local state so we can update it after edit
  const [property, setProperty] = useState(state?.property);

  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [propForm, setPropForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [propImages, setPropImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // True when the user has actually changed at least one field or picked new images
  const hasChanges = propImages.length > 0 ||
    JSON.stringify(propForm) !== JSON.stringify(originalForm);

  if (!property) {
    return (
      <div className="container min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
        <Home size={64} className="text-muted opacity-30" />
        <p className="text-2xl font-black text-muted">Property not found</p>
        <button onClick={() => navigate('/')} className="btn btn-primary px-8 py-4 rounded-2xl">
          <ArrowLeft size={18} /> Go Home
        </button>
      </div>
    );
  }

  // Check if the logged-in user owns this property
  const isOwner = user && property.user_id &&
    String(user.user_id) === String(property.user_id);

  const images = property.images?.length
    ? property.images.map(img => `${API_URL}/${img}`)
    : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200'];

  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);
  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const openEdit = () => {
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
    setOriginalForm(initial);   // snapshot for dirty detection
    setPropImages([]);
    setShowEditModal(true);
  };

  const handlePropertyEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    Object.entries(propForm).forEach(([k, v]) => fd.append(k, v));
    propImages.forEach(img => fd.append('images', img));

    const result = await updateProperty(property.p_id, fd);
    setSaving(false);

    if (result.success) {
      // Update local property state so the page reflects the changes immediately
      setProperty(prev => ({ ...prev, ...propForm }));
      setShowEditModal(false);
      showMsg('success', 'Property updated successfully!');
    } else {
      showMsg('error', result.message || 'Failed to update property.');
    }
  };

  return (
    <div className="container py-24 animate-fade-in relative">
      <div className="blob top-0 right-0 opacity-40" />

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
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-8 relative z-10 flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted hover:text-foreground font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        <div className="flex gap-3 items-center">
          {/* Edit button — only visible to the property owner */}
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openEdit}
              id="edit-property-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all font-bold text-sm shadow-lg shadow-primary/10"
            >
              <Edit size={16} />
              Edit Property
            </motion.button>
          )}

          <button
            onClick={() => setWishlisted(w => !w)}
            className={`p-3 rounded-2xl border border-border transition-all ${
              wishlisted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'hover:bg-surface-alt'
            }`}
          >
            <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="p-3 rounded-2xl border border-border hover:bg-surface-alt transition-all"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 relative z-10">
        {/* Left: Images + Details */}
        <div className="xl:col-span-2 flex flex-col gap-8">

          {/* Image Slider */}
          <div className="modern-card overflow-hidden relative aspect-[16/9] md:aspect-[2/1] bg-surface-alt">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={images[imgIdx]}
                alt={`Property image ${imgIdx + 1}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all z-10"
                >
                  <ChevronRight size={20} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`rounded-full transition-all ${
                        i === imgIdx ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Verified badge */}
            <div className="absolute top-4 left-4 z-10 glass px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Shield size={12} className="text-green-400" />
              Verified Listing
            </div>

            {/* Owner badge */}
            {isOwner && (
              <div className="absolute top-4 right-4 z-10 bg-primary/90 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                <Edit size={11} />
                Your Listing
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === imgIdx ? 'border-primary shadow-lg shadow-primary/30' : 'border-border opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Location */}
          <div className="modern-card p-8 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{property.name}</h1>
              <div className="flex items-center gap-2 text-muted font-semibold">
                <MapPin size={18} className="text-secondary shrink-0" />
                <span>{property.city}, {property.country}</span>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div>
              <h3 className="text-sm font-black text-muted uppercase tracking-widest mb-4">Description</h3>
              <p className="text-foreground/80 leading-relaxed font-medium">
                {property.description || 'No description provided for this property.'}
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedRooms || 'N/A', color: 'text-primary', bg: 'bg-primary/10' },
                { icon: IndianRupee, label: 'Monthly Rent', value: `₹${property.rent ? Number(property.rent).toLocaleString('en-IN') : 'N/A'}`, color: 'text-green-400', bg: 'bg-green-500/10' },
                { icon: IndianRupee, label: 'Security Deposit', value: property.amount ? `₹${Number(property.amount).toLocaleString('en-IN')}` : 'N/A', color: 'text-secondary', bg: 'bg-secondary/10' },
                { icon: Calendar, label: 'Listed On', value: formatDate(property.created_at), color: 'text-accent', bg: 'bg-accent/10' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="glass p-4 rounded-2xl border border-border/50 flex flex-col gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon size={16} className={color} />
                  </div>
                  <span className="text-xs font-black text-muted uppercase tracking-wide">{label}</span>
                  <span className="font-black text-sm leading-tight">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pricing + Contact */}
        <div className="flex flex-col gap-6">
          {/* Pricing Card */}
          <div className="modern-card p-8 flex flex-col gap-6 sticky top-28">
            <div>
              <div className="text-muted text-sm font-bold uppercase tracking-wider mb-1">Monthly Rent</div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black">₹{property.rent ? Number(property.rent).toLocaleString('en-IN') : '—'}</span>
                <span className="text-muted font-semibold mb-1">/mo</span>
              </div>
              {property.amount && (
                <div className="text-sm text-muted mt-2 font-medium">
                  + ₹{Number(property.amount).toLocaleString('en-IN')} security deposit
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted">Property ID</span>
                <span className="font-mono text-xs bg-surface-alt px-3 py-1 rounded-lg">{property.p_id}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted">City</span>
                <span>{property.city}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted">Country</span>
                <span>{property.country}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted">Bedrooms</span>
                <span>{property.bedRooms}</span>
              </div>
            </div>

            {/* Owner actions or contact CTA */}
            {isOwner ? (
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={openEdit}
                  className="btn btn-primary w-full justify-center py-4 rounded-2xl text-base"
                >
                  <Edit size={18} />
                  Edit This Property
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="btn btn-ghost w-full justify-center py-4 rounded-2xl text-base border-border"
                >
                  Manage All Properties
                </button>
              </div>
            ) : user ? (
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="mailto:contact@rentera.com"
                  className="btn btn-primary w-full justify-center py-4 rounded-2xl text-base"
                >
                  Contact Landlord
                </a>
                <button className="btn btn-ghost w-full justify-center py-4 rounded-2xl text-base border-border">
                  Schedule Viewing
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-muted text-sm font-bold mb-4 text-center">
                  Login to contact the landlord
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary w-full justify-center py-4 rounded-2xl text-base"
                >
                  Login to Enquire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Property Modal ── */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <div className="modern-card p-8 rounded-3xl border border-border max-h-[88vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black">Edit Property</h3>
                    <p className="text-muted text-sm mt-1">Update your listing details below</p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-surface-alt rounded-xl transition-colors"
                  >
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
                    <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center relative hover:border-primary transition-colors bg-surface-alt/20 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setPropImages([...e.target.files])}
                      />
                      <Upload size={24} className="mx-auto text-muted mb-2" />
                      <p className="text-sm font-bold text-muted">
                        {propImages.length > 0
                          ? `${propImages.length} file(s) selected`
                          : 'Click to upload new images'}
                      </p>
                      <p className="text-xs text-muted/70 mt-1">This will replace existing images</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !hasChanges}
                      id="save-property-edit-btn"
                      className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </span>
                      ) : hasChanges ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          Update Property
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 opacity-60">
                          No Changes Yet
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;
