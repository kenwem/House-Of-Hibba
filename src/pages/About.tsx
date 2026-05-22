import { motion } from 'motion/react';
import { useSettings } from '../hooks/useSettings';
import { Loader2 } from 'lucide-react';

const COLORS = {
  pink: '#FF69B4',
  gold: '#D4AF37',
};

export default function About() {
  const { settings, loading } = useSettings();

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[260px] flex items-center justify-center overflow-hidden">
        <img 
          src={settings?.aboutHeroImage || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600"} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="About Banner"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6">
           <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            {settings?.aboutStorySubtitle || "Our Heritage"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white"
          >
            {settings?.aboutStoryTitle || "The House of Hibba Story"}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 mb-24">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
             <div className="aspect-[3/4] rounded-[40px] overflow-hidden">
               <img 
                 src={settings?.aboutSideImage || "https://images.unsplash.com/photo-1561822713-da02f57225b2?w=500&auto=format&fit=crop&q=60"} 
                 alt="Tailoring"
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
             </div>
             <div className="absolute -bottom-8 -right-8 bg-charcoal p-8 rounded-3xl border border-white/5 shadow-2xl">
                <span className="text-4xl font-display text-gold block mb-1">Est. 2020</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Founded in Lagos, Nigeria</span>
             </div>
          </motion.div>

          <div className="space-y-8">
            <h2 className="text-3xl font-display text-white uppercase tracking-wider">Vision & Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {settings?.aboutStoryText1 || "To become a globally recognized modest fashion brand known for creativity, quality, and excellence in fashion training."}
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              {settings?.aboutStoryText2 || "To empower women through fashion by creating modest outfits and equipping aspiring fashion designers with practical sewing skills and creativity."}
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
              <div>
                <h4 className="text-2xl font-display text-white mb-2" style={{ color: COLORS.gold }}>Elegance</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Our core design philosophy</p>
              </div>
              <div>
                <h4 className="text-2xl font-display text-white mb-2" style={{ color: COLORS.gold }}>Integrity</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">In every stitch and interaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <h3 className="text-4xl font-display text-white mb-8 italic">
             "{settings?.aboutQuote || "Fashion is not just about what you wear, it's about how you feel. We style your dreams perfectly."}"
           </h3>
           <div className="w-20 h-1 bg-pink-500 mx-auto"></div>
        </div>
      </section>
    </div>
  );
}
