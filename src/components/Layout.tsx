import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, MessageCircle, Phone, Mail, Facebook, Twitter } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../contexts/AuthContext';

const COLORS = {
  pink: '#FF69B4',
  gold: '#D4AF37',
  black: '#000000',
};

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Collections', href: '/collections' },
  { name: 'Trainings', href: '/trainings' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const companyName = settings?.companyName || "HOUSE OF HIBBA";
  const nameParts = companyName.split(' ');
  const firstPart = nameParts.slice(0, -1).join(' ') || "HOUSE OF";
  const lastPart = nameParts[nameParts.length - 1] || "HIBBA";

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md py-4' : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Link to="/" className="text-xl md:text-2xl font-display font-bold tracking-tighter" style={{ color: COLORS.gold }}>
            {settings?.logo ? (
              <img src={settings.logo} alt={companyName} className="h-8 md:h-10 w-auto" />
            ) : (
              <>
                {firstPart} <span style={{ color: COLORS.pink }}>{lastPart}</span>
              </>
            )}
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors mt-1 ${
                location.pathname === link.href ? 'text-pink-500' : 'text-white hover:text-pink-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-6 ml-4 pl-6 border-l border-white/10">
            <Link 
              to="/contact"
              className="px-6 py-2 bg-gold-gradient text-black font-semibold rounded-full text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity uppercase"
              style={{ background: `linear-gradient(45deg, ${COLORS.gold}, #F7E7CE)` }}
            >
              Book Now
            </Link>
          </div>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full border-t border-white/10 py-10 px-6 flex flex-col items-center gap-6 md:hidden shadow-2xl bg-[#1a1a1a]"
          >
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className={`text-lg uppercase tracking-widest ${location.pathname === link.href ? 'text-pink-400 font-bold' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact"
              className="w-full py-4 text-center bg-gold-gradient text-black font-bold uppercase tracking-widest rounded-lg"
              style={{ background: `linear-gradient(45deg, ${COLORS.gold}, #F7E7CE)` }}
            >
              Book Appointment
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  const location = useLocation();
  const { settings } = useSettings();
  
  const companyName = settings?.companyName || "HOUSE OF HIBBA";
  const nameParts = companyName.split(' ');
  const firstPart = nameParts.slice(0, -1).join(' ') || "HOUSE OF";
  const lastPart = nameParts[nameParts.length - 1] || "HIBBA";

  const whatsappUrl = settings?.companyWhatsapp 
    ? `https://wa.me/${settings.companyWhatsapp.replace(/\D/g, '')}` 
    : "https://wa.me/2348188341596";

  const socialLinks = [
    { icon: Instagram, href: settings?.instagram || "https://www.instagram.com/houseofhibba_fashion" },
    { icon: Facebook, href: settings?.facebook },
    { icon: Twitter, href: settings?.twitter },
    { icon: Phone, href: `tel:${settings?.companyPhone || "08131815548"}` },
    { icon: MessageCircle, href: whatsappUrl },
  ].filter(link => link.href);

  return (
    <footer className="pt-24 pb-12 border-t border-white/5 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-display font-bold mb-6" style={{ color: COLORS.gold }}>
              {firstPart} <span style={{ color: COLORS.pink }}>{lastPart}</span>
            </h3>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              {settings?.aboutText || "Crafting premium modest fashion since 2020. Based in the heart of Lagos, dressing the global woman with elegance and confidence."}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold transition-all"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h6 className="text-white font-bold uppercase tracking-widest text-[10px] mb-8">Navigation</h6>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}><Link to={link.href} className="text-gray-500 hover:text-pink-400 transition-colors text-xs">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="text-white font-bold uppercase tracking-widest text-[10px] mb-8">Contact Us</h6>
            <p className="text-gray-500 text-xs mb-6 max-w-[200px]">
              {settings?.companyAddress || "Nigeria"}
            </p>
            <div className="space-y-2">
              <p className="text-gray-500 text-xs">{settings?.companyPhone || ""}</p>
              <p className="text-gray-500 text-xs">{settings?.companyEmail || ""}</p>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            © 2026 House of <Link to="/admin" className="hover:text-pink-500 transition-colors font-bold">Hibba</Link>. All rights reserved.
          </p>
        </div>
      </div>
      <motion.a 
        href={`https://wa.me/${settings?.companyWhatsapp || "2348188341596"}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl z-50 shadow-black/50"
      >
        <MessageCircle size={28} />
      </motion.a>
    </footer>
  );
};
