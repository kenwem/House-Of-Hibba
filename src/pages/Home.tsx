import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  MessageCircle, 
  Scissors, 
  Award, 
  Users, 
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { fetchData } from '../services/firestore';
import SEO from '../components/SEO';

const COLORS = {
  pink: '#FF69B4',
  gold: '#D4AF37',
  black: '#000000',
};

const Hero = ({ settings }: { settings: any }) => {
  const heroImage = settings?.heroImageDesktop || "https://i.imgur.com/4A4gEqV.jpeg";
  const mobileImage = settings?.heroImageMobile || heroImage;

  return (
    <section className="relative h-screen min-h-[600px] flex items-start md:items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {settings?.heroVideo ? (
          <video 
            src={settings.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <picture>
            <source media="(max-width: 768px)" srcSet={mobileImage} />
            <img 
              src={heroImage} 
              alt="House of Hibba Fashion"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </picture>
        )}
        {/* Transparent overlay as requested */}
        <div className="absolute inset-0 bg-[#1a1a1a]/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/40 via-transparent to-[#1a1a1a]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1.5 }}
            className="inline-block px-5 py-2 rounded-full bg-pink-500/10 text-pink-400 text-[9px] md:text-[10px] font-bold uppercase mb-6 md:mb-8 border border-pink-500/20 backdrop-blur-md"
          >
            {settings?.footerText || "Dream Big, Style Perfectly"}
          </motion.span>
          
          <h1 className="text-4xl md:text-8xl font-display font-medium text-white leading-[1.1] mb-6 md:mb-8 tracking-tight">
             {settings?.heroTitle?.split('|')[0] || "Elegant"} <span className="text-gold-gradient" style={{ color: COLORS.gold }}>{settings?.heroTitle?.split('|')[1] || "Modest"}</span> Fashion <br/>
            <span className="italic serif font-serif opacity-90 text-2xl md:text-8xl block md:inline mt-2 md:mt-0">{settings?.heroSubtitle || "for the Classy Woman"}</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-200 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed font-light px-4 md:px-0">
            {settings?.metaDescription || "Houseofhibba Fashion is a modest fashion brand focused on creating elegant, stylish, and well-tailored outfits for women."}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/contact"
              className="px-12 py-5 bg-gold-gradient text-black font-bold rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(45deg, ${COLORS.gold}, #F7E7CE)` }}
            >
              Book Appointment <ChevronRight size={18} />
            </Link>
            <a 
              href={`https://wa.me/${settings?.companyWhatsapp || "2348188341596"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 border border-white/30 backdrop-blur-md text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">Explore Heritage</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

const FeatureSection = () => {
  const highlights = [
    { title: 'Exquisite Craftsmanship', icon: <Scissors size={20} />, text: 'Every stitch tells a story of precision and passion.' },
    { title: 'Global Elegance', icon: <Award size={20} />, text: 'Modern modest designs recognized for unique sophistication.' },
    { title: 'Empowering Women', icon: <Users size={20} />, text: 'Inspiring confidence through perfectly tailored garments.' },
  ];

  return (
    <section className="py-24 bg-[#1a1a1a] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-16">
          {highlights.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-charcoal border border-white/5 mx-auto mb-6 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="text-lg font-display text-white mb-3 uppercase tracking-widest">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { settings, loading } = useSettings();

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  return (
    <div className="bg-[#1a1a1a]">
      <SEO />
      <Hero settings={settings} />
      <FeatureSection />
      
      {/* Short About Preview */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
             <span className="text-pink-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Philosophy</span>
             <h2 className="text-4xl md:text-6xl font-display text-white mb-8 leading-tight">
               {settings?.aboutTagline || "Where Modesty Meets"} <br/><span className="text-gold" style={{ color: COLORS.gold }}>{settings?.aboutTaglineGold || "Unrivaled Luxury"}</span>
             </h2>
             <p className="text-gray-400 text-lg mb-10 leading-relaxed">
               {settings?.aboutText || "Houseofhibba Fashion is a modest fashion brand focused on creating elegant, stylish, and well-tailored outfits for women. We equip aspiring designers with practical sewing skills."}
             </p>
             <Link to="/about" className="inline-flex items-center gap-4 text-white font-bold uppercase tracking-[0.2em] text-[10px] group transition-all">
                Discover Our Story 
                <span className="w-12 h-[1px] bg-white group-hover:w-20 transition-all duration-500"></span>
             </Link>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <img 
                src={settings?.aboutImage || "https://images.unsplash.com/photo-1574701148212-8518049c7b2c?auto=format&fit=crop&q=80&w=800"}
                className="rounded-[40px] shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700 w-full h-full object-cover"
                alt="Fashion Design"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gold/10 rounded-full blur-[60px]" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center bg-charcoal border-y border-white/5">
        <div className="px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display text-white mb-8">{settings?.ctaTitle || "Ready to define your own style?"}</h2>
          <p className="text-gray-400 mb-12 text-lg">{settings?.ctaSubtitle || "Explore our curated collections or visit us for a personalized fitting session."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/collections" className="px-10 py-4 bg-white text-black font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-gold transition-colors">View Collections</Link>
            <Link to="/contact" className="px-10 py-4 border border-white text-white font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-colors">Find Our Store</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
