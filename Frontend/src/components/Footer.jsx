import React from 'react';
import { Home, Globe, Send, Camera, Link2, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden border-t border-border">
      <div className="blob bottom-[-250px] left-1/2 -translate-x-1/2 opacity-30" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 text-3xl font-black tracking-tighter mb-8 group cursor-pointer">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                <Home className="text-white" size={28} />
              </div>
              <span className="text-foreground">RENTERA</span>
            </div>
            <p className="text-muted font-medium leading-relaxed mb-8">
              The next dimension of property rental. Curating the world's most architectural spaces for the visionaries of tomorrow.
            </p>
            <div className="flex gap-4">
              {[Globe, Send, Camera, Link2].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-border rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-8">Navigation</h3>
            <ul className="flex flex-col gap-4 text-foreground font-bold">
              <li><a href="#" className="hover:text-primary flex items-center gap-2 group">Marketplace <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></a></li>
              <li><a href="#" className="hover:text-primary flex items-center gap-2 group">Analytics <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></a></li>
              <li><a href="#" className="hover:text-primary flex items-center gap-2 group">Governance <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></a></li>
              <li><a href="#" className="hover:text-primary flex items-center gap-2 group">Protocols <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-8">Ecosystem</h3>
            <ul className="flex flex-col gap-4 text-foreground font-bold">
              <li><a href="#" className="hover:text-primary">Docs</a></li>
              <li><a href="#" className="hover:text-primary">Github</a></li>
              <li><a href="#" className="hover:text-primary">Whitepaper</a></li>
              <li><a href="#" className="hover:text-primary">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-8">Subscription</h3>
            <p className="text-sm text-muted font-medium mb-6">Receive encrypted updates on latest drops.</p>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-alt p-1 rounded-2xl flex border border-border focus-within:border-primary transition-colors">
                <input type="email" placeholder="email@system.auth" className="bg-transparent border-none px-4 py-3 w-full outline-none text-sm font-bold" />
                <button className="btn btn-primary py-2 px-6 rounded-xl text-sm">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted font-black text-[10px] tracking-[0.3em] uppercase">
          <p>© {new Date().getFullYear()} RENTERA CORE UNIT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-primary transition-colors">Privacy.exe</a>
            <a href="#" className="hover:text-primary transition-colors">Terms.sys</a>
            <a href="#" className="hover:text-primary transition-colors">Legal.log</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
