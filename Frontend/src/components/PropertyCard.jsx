import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, ArrowUpRight, IndianRupee, Home, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:4000';

const PropertyCard = ({ property, showActions, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!property) return null;

  const imageUrl = property.images?.[0]
    ? `${API_BASE}/${property.images[0]}`
    : null;

  const handleCardClick = () => {
    navigate(`/property/${property.p_id}`, { state: { property } });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="modern-card group border border-border cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`View ${property.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 z-10" />

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback placeholder */}
        <div
          className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <Home size={48} className="text-primary/40" />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20">
          <div className="glass px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            ✓ Verified
          </div>
        </div>

        {/* Rent on image */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-white">
              ₹{property.rent ? Number(property.rent).toLocaleString('en-IN') : '—'}
            </span>
            <span className="text-white/70 text-sm font-semibold mb-0.5">/ mo</span>
          </div>
        </div>

        {/* Arrow top-right */}
        <div className="absolute top-4 right-4 z-20 w-9 h-9 glass rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="max-w-[80%]">
            <h3 className="text-lg font-extrabold mb-1.5 truncate group-hover:text-primary transition-colors">
              {property.name || 'Unnamed Property'}
            </h3>
            <div className="flex items-center gap-1.5 text-muted text-sm font-medium">
              <MapPin size={14} className="text-secondary shrink-0" />
              <span className="truncate">{property.city}, {property.country}</span>
            </div>
          </div>
        </div>

        {/* Description preview */}
        {property.description && (
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2 font-medium">
            {property.description}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center gap-5 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bed size={14} />
            </div>
            <span className="font-bold text-sm">{property.bedRooms} BHK</span>
          </div>

          {property.amount && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <IndianRupee size={14} />
              </div>
              <span className="font-bold text-sm text-muted">
                ₹{Number(property.amount).toLocaleString('en-IN')} dep.
              </span>
            </div>
          )}

          <div className="ml-auto text-xs font-black uppercase tracking-wider text-primary/70 group-hover:text-primary transition-colors">
            View →
          </div>
        </div>

        {/* Action buttons for owner view */}
        {showActions && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="flex-1 btn btn-ghost py-2.5 text-sm justify-center hover:bg-primary/10 hover:text-primary border-border gap-1.5"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 btn py-2.5 text-sm justify-center bg-red-500/10 text-red-400 border-none hover:bg-red-500 hover:text-white gap-1.5"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyCard;
