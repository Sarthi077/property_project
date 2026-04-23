import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, User, LogOut, Plus, Moon, Sun, Menu, X } from 'lucide-react';

const Navbar = () => {
  // Safe Context Access
  const auth = useAuth() || {};
  const theme = useTheme() || {};
  const [menuOpen, setMenuOpen] = useState(false);
  
  const user = auth.user;
  const logout = auth.logout;
  const isDark = theme.isDark;
  const toggleTheme = theme.toggleTheme;

  return (
    <nav className="glass sticky top-0 z-[100] py-3 md:py-4 px-4 md:px-6 border-b border-border">
      <div className="container flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary flex items-center justify-center rounded-xl shrink-0">
            <Home className="text-white" size={22} />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">RENTERA</span>
        </Link>

        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <button 
            onClick={() => toggleTheme && toggleTheme()} 
            className="p-3 rounded-xl border border-border hover:bg-surface-alt transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/add-property" className="btn btn-primary py-2.5 px-5">
                <Plus size={18} />
                <span className="hidden sm:inline">List Property</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2 btn btn-ghost py-2.5">
                <div className="w-8 h-8 bg-surface-alt rounded-full flex items-center justify-center font-bold">
                  {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:inline">{user.user_name}</span>
              </Link>
              <button onClick={() => logout && logout()} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold px-4">Log in</Link>
              <Link to="/register" className="btn btn-primary py-2.5 px-6">Get Started</Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => toggleTheme && toggleTheme()} 
            className="p-2.5 rounded-xl border border-border hover:bg-surface-alt transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="p-2.5 rounded-xl border border-border hover:bg-surface-alt transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="container md:hidden mt-3">
          <div className="modern-card p-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to="/add-property"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary py-3 justify-center"
                >
                  <Plus size={18} />
                  <span>List Property</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost py-3 justify-center"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout && logout();
                  }}
                  className="btn bg-red-500/10 text-red-500 border-none py-3 justify-center hover:bg-red-500 hover:text-white"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost py-3 justify-center"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary py-3 justify-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
