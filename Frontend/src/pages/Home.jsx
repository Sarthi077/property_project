import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import {
  Search, SlidersHorizontal, ArrowRight, Sparkles,
  MapPin, Building2, ChevronLeft, ChevronRight, TrendingUp, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:4000/api';
const ITEMS_PER_PAGE = 9;

const stats = [
  { icon: Building2, label: 'Properties Listed', value: '2,400+' },
  { icon: Users,     label: 'Happy Renters',     value: '14,000+' },
  { icon: MapPin,    label: 'Cities Covered',    value: '180+' },
  { icon: TrendingUp, label: 'Avg. Savings',     value: '₹8K/mo' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties]     = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [sortBy, setSortBy]             = useState('newest');
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);

  // ── Fetch ──────────────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/property/list-all-property/`, {
        params: { page, limit: ITEMS_PER_PAGE }
      });
      if (response.data.status) {
        const data = response.data.properties || [];
        setProperties(data);
        setTotalPages(data.length < ITEMS_PER_PAGE ? page : page + 1);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // ── Client-side filter & sort ─────────────────────────────────────
  useEffect(() => {
    let result = [...properties];
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.country?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    if (bedroomFilter) {
      result = result.filter(p => Number(p.bedRooms) === Number(bedroomFilter));
    }
    if (sortBy === 'rent-asc')  result.sort((a, b) => Number(a.rent) - Number(b.rent));
    if (sortBy === 'rent-desc') result.sort((a, b) => Number(b.rent) - Number(a.rent));
    if (sortBy === 'beds-desc') result.sort((a, b) => Number(b.bedRooms) - Number(a.bedRooms));
    setFiltered(result);
  }, [properties, searchTerm, bedroomFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setBedroomFilter('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="relative overflow-hidden pt-20">
      <div className="blob top-[-100px] left-[-100px]" />
      <div className="blob bottom-0 right-[-100px] rotate-180" />

      <main className="container">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative z-10 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            <span>AI-POWERED REAL ESTATE MATCHING</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-text mb-10"
          >
            FIND YOUR <br /> PERFECT HOME.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted max-w-3xl mx-auto mb-16 px-4"
          >
            Browse thousands of curated rental listings across India and find your dream home today.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={(e) => { e.preventDefault(); setPage(1); }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto glass p-3 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-4 shadow-2xl"
          >
            <div className="flex-1 w-full flex items-center gap-4 px-6 border-b md:border-b-0 md:border-r border-border py-4 md:py-0">
              <Search className="text-muted shrink-0" size={22} />
              <input
                id="search-input"
                type="text"
                placeholder="City, country or property name..."
                className="bg-transparent border-none outline-none w-full text-lg font-medium placeholder:text-muted"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} className="text-muted hover:text-foreground text-xl font-bold shrink-0">
                  ✕
                </button>
              )}
            </div>

            <div className="w-full md:w-auto px-6 py-4 md:py-0 text-left border-b md:border-b-0 md:border-r border-border">
              <span className="text-xs font-bold text-muted uppercase block mb-0.5">Bedrooms</span>
              <select
                id="bedroom-filter"
                value={bedroomFilter}
                onChange={(e) => { setBedroomFilter(e.target.value); setPage(1); }}
                className="bg-transparent border-none outline-none font-bold text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} BHK</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full md:w-auto py-5 px-10 rounded-3xl">
              <span>Search</span>
              <ArrowRight size={20} />
            </button>
          </motion.form>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-24"
        >
          {stats.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-3xl border border-border text-center"
            >
              <div className="w-11 h-11 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon size={20} />
              </div>
              <div className="text-2xl font-black mb-1">{value}</div>
              <div className="text-xs text-muted font-bold uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── Listings ──────────────────────────────────────────── */}
        <section className="mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <h2 className="text-4xl font-black mb-4">CURATED LISTINGS</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="modern-input py-3 px-4 w-auto text-sm font-bold"
              >
                <option value="newest">Newest First</option>
                <option value="rent-asc">Rent: Low → High</option>
                <option value="rent-desc">Rent: High → Low</option>
                <option value="beds-desc">Most Bedrooms</option>
              </select>

              <button
                onClick={() => setPage(1)}
                className="p-3 rounded-2xl border border-border hover:bg-surface transition-colors flex items-center gap-2 font-bold text-sm"
              >
                <SlidersHorizontal size={18} />
                Filters {(searchTerm || bedroomFilter) ? <span className="w-2 h-2 bg-primary rounded-full" /> : null}
              </button>

              {(searchTerm || bedroomFilter) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted hover:text-foreground font-bold underline underline-offset-4"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {(searchTerm || bedroomFilter) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex flex-wrap gap-3"
              >
                {searchTerm && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
                    <Search size={13} /> "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="text-primary/60 hover:text-primary">✕</button>
                  </span>
                )}
                {bedroomFilter && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-bold border border-secondary/20">
                    {bedroomFilter} Bedroom(s)
                    <button onClick={() => setBedroomFilter('')} className="text-secondary/60 hover:text-secondary">✕</button>
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-muted font-bold mb-8">
              Showing <span className="text-foreground font-black">{filtered.length}</span> propert{filtered.length === 1 ? 'y' : 'ies'}
              {(searchTerm || bedroomFilter) ? ' matching your search' : ''}
            </p>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" className="grid-auto">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="modern-card h-[430px] animate-pulse bg-surface-alt/50" />
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-16 rounded-[3rem] text-center border-dashed border-2 border-border"
              >
                <Search size={56} className="mx-auto text-muted mb-5 opacity-30" />
                <p className="text-2xl font-black mb-3 text-muted">No properties found</p>
                <p className="text-muted text-sm mb-8">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn btn-primary px-10 py-4 rounded-2xl">
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div key="grid" layout className="grid-auto">
                {filtered.map((property, idx) => (
                  <motion.div
                    key={property.p_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all ${
                    p === page ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'border border-border hover:bg-surface-alt'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={properties.length < ITEMS_PER_PAGE}
                className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[3rem] p-12 md:p-20 text-center border border-primary/20 mb-20 relative overflow-hidden"
        >
          <div className="blob top-0 left-1/2 -translate-x-1/2 opacity-30" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-wider mb-8">
              <Sparkles size={14} /> List Your Property
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Own a Property?<br />Start Earning Today.
            </h2>
            <p className="text-muted font-medium max-w-xl mx-auto mb-10">
              List your property on Rentera and connect with thousands of verified tenants.
            </p>
            <button
              onClick={() => navigate('/add-property')}
              className="btn btn-primary px-12 py-5 text-lg rounded-2xl shadow-2xl shadow-primary/30"
            >
              List a Property <ArrowRight size={20} />
            </button>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default HomePage;
