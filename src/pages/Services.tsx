import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Scissors, Award, Users, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { fetchData } from '../services/firestore';
import { useSettings } from '../hooks/useSettings';

const DEFAULT_SERVICES = [
  {
    title: 'Ready-to-Wear',
    description: 'Exquisite, high-quality modest outfits ready for any occasion. Designed for the modern woman on the go.',
    icon: <ShoppingBag className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1539109132384-51af51d7bbef?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Made-to-Measure',
    description: 'Bespoke tailoring specifically to your unique measurements and personal style preferences.',
    icon: <Scissors className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Bridal Wears',
    description: 'Elegant and sophisticated modest bridal collections. We turn your bridal dreams into white-silk reality.',
    icon: <Award className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Fashion Trainings',
    description: 'Comprehensive design and tailoring programs. Learn from industry experts and build your own empire.',
    icon: <Users className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1524311583145-d419616d2524?auto=format&fit=crop&q=80&w=600',
  },
];

export default function Services() {
  const { settings, loading: settingsLoading } = useSettings();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchData("services", "title", "asc");
        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      } catch (error) {
        console.error(error);
        setServices(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading || settingsLoading) return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src={settings?.servicesHeroImage || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600"} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Services Banner"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6">
           <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            What We Do
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white"
          >
            Our <span className="text-gold" style={{ color: '#D4AF37' }}>Premier</span> Services
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 mb-24">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            What We Do
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white"
          >
            Our <span className="text-gold">Premier</span> Services
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-6 text-lg">
            From bespoke tailoring to professional fashion training, we provide a holistic approach to luxury modest fashion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title || service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-charcoal p-10 rounded-[40px] border border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-[#1a1a1a] text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500 shadow-xl">
                  {service.icon || <ShoppingBag className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-display text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-10 leading-relaxed text-sm">{service.description}</p>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500 group-hover:text-gold transition-colors">
                  Learn More <ChevronRight size={14} />
                </button>
              </div>
              
              {/* Decorative image background on hover */}
              <div className="absolute inset-x-0 bottom-0 top-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none grayscale">
                <img src={service.image} className="w-full h-full object-cover" alt="" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bridal Specialty Highlight */}
      <section className="py-24 bg-[#050505] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-[40px] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=800" alt="Bridal Wear" className="w-full h-full object-cover" />
            </div>
            <div>
               <span className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Specialty Service</span>
               <h2 className="text-4xl md:text-6xl font-display text-white mb-8">Bespoke Bridal Consultations</h2>
               <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                 Every bride deserves a unique story. Our bridal service is a private, multi-step process from consultation to the big day, ensuring your modest gown is a flawless masterpiece.
               </p>
               <button className="px-10 py-4 border border-gold text-gold font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-gold hover:text-black transition-all">Book Your Slot</button>
            </div>
         </div>
      </section>
    </div>
  );
}
