import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2, MapPin, IndianRupee, Bed, Upload, Sparkles,
  Box, CheckCircle2, Plus, X, AlertCircle, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddProperty = () => {
  const { createProperty } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    country: '',
    rent: '',
    amount: '',
    bedRooms: '',
    pId: Math.floor(Math.random() * 1000000000)
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    const newImages = images.filter((_, i) => i !== idx);
    const newPreviews = previewUrls.filter((_, i) => i !== idx);
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    images.forEach(img => data.append('images', img));

    const result = await createProperty(data);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || 'Failed to create property. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="container min-h-screen flex flex-col items-center justify-center py-20 relative">
        <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[3rem] text-center max-w-lg w-full border border-green-500/20 relative z-10"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-black mb-4">Property Listed!</h2>
          <p className="text-muted font-medium mb-10">
            Your property <span className="text-foreground font-bold">"{formData.name}"</span> has been successfully listed and is now live.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/profile')} className="btn btn-primary w-full py-4 justify-center rounded-2xl">
              View My Properties
            </button>
            <button onClick={() => navigate('/')} className="btn btn-ghost w-full py-4 justify-center rounded-2xl">
              Browse Listings
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-20 animate-fade-in relative">
      <div className="blob top-0 left-0 opacity-50" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-foreground font-bold mb-8 group transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            <span>New Listing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">LIST A PROPERTY</h1>
          <p className="text-xl text-muted font-medium">Broadcast your property to thousands of potential renters.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold"
          >
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Main Details ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Core Info */}
            <div className="modern-card p-8 flex flex-col gap-7">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Box size={20} className="text-primary" />
                </div>
                Property Details
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest">Property Name *</label>
                <input
                  name="name"
                  type="text"
                  className="modern-input"
                  placeholder="e.g. The Zenith Heights, Studio 4B"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest">Description</label>
                <textarea
                  name="description"
                  className="modern-input min-h-[140px] resize-y"
                  placeholder="Describe your property — amenities, condition, nearby landmarks..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-muted uppercase tracking-widest">
                    <MapPin size={12} className="inline mr-1" />City *
                  </label>
                  <input
                    name="city"
                    type="text"
                    className="modern-input"
                    placeholder="Mumbai, Delhi, Pune..."
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-muted uppercase tracking-widest">Country *</label>
                  <input
                    name="country"
                    type="text"
                    className="modern-input"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="modern-card p-8 flex flex-col gap-6">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Upload size={20} className="text-secondary" />
                </div>
                Property Photos
              </h3>

              <div className="border-2 border-dashed border-border rounded-[2rem] p-10 text-center flex flex-col items-center gap-4 hover:border-primary transition-all cursor-pointer bg-surface-alt/20 hover:bg-surface-alt/40 relative">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Plus size={28} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">Click or drag to upload photos</p>
                  <p className="text-xs text-muted font-medium">JPG, PNG, WEBP — Multiple files supported</p>
                </div>
              </div>

              {/* Previews */}
              <AnimatePresence>
                {previewUrls.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                  >
                    {previewUrls.map((url, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square rounded-xl overflow-hidden group border border-border"
                      >
                        <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Pricing + Submit ── */}
          <div className="flex flex-col gap-6">

            {/* Pricing */}
            <div className="modern-card p-8 flex flex-col gap-6">
              <h3 className="text-xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <IndianRupee size={20} className="text-green-400" />
                </div>
                Pricing
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted uppercase">Monthly Rent (₹) *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    name="rent"
                    type="number"
                    min="0"
                    className="modern-input pl-10"
                    placeholder="25000"
                    value={formData.rent}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted uppercase">Security Deposit (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    className="modern-input pl-10"
                    placeholder="50000"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="modern-card p-8 flex flex-col gap-6">
              <h3 className="text-xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-accent" />
                </div>
                Specifications
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted uppercase">Bedrooms *</label>
                <div className="relative">
                  <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    name="bedRooms"
                    type="number"
                    min="1"
                    max="20"
                    className="modern-input pl-10"
                    placeholder="2"
                    value={formData.bedRooms}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Quick bedroom picker */}
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData({ ...formData, bedRooms: String(n) })}
                    className={`w-12 h-12 rounded-xl font-black text-sm border transition-all ${
                      formData.bedRooms === String(n)
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                        : 'border-border hover:bg-surface-alt'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="modern-card p-6 border border-primary/20 bg-primary/5 flex flex-col gap-4">
              <h4 className="text-sm font-black text-muted uppercase tracking-wider">Summary</h4>
              <div className="flex flex-col gap-2 text-sm font-bold">
                <div className="flex justify-between">
                  <span className="text-muted">Name</span>
                  <span className="truncate max-w-[60%] text-right">{formData.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Location</span>
                  <span>{formData.city || '—'}{formData.country ? `, ${formData.country}` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Rent</span>
                  <span className="text-green-400">{formData.rent ? `₹${Number(formData.rent).toLocaleString('en-IN')}/mo` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Photos</span>
                  <span>{images.length} uploaded</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="submit-property"
              disabled={loading}
              className="btn btn-primary w-full py-6 text-xl rounded-[2rem] shadow-2xl shadow-primary/40 justify-center disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={22} />
                  Publish Listing
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
