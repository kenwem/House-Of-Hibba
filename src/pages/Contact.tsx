import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Instagram, Loader2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
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
          src={settings?.contactHeroImage || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600"} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Contact Banner"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6">
           <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white"
          >
            Visit Our <span className="text-gold" style={{ color: '#D4AF37' }}>Atelier</span>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 mb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-charcoal p-10 rounded-[40px] border border-white/5 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-gold mb-6"><MapPin /></div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs">Our Studio</h4>
                   <p className="text-gray-400 text-sm">{settings?.companyAddress || "221 Ijesha Road, Surulere, Lagos."}</p>
                   <p className="text-[10px] text-pink-500 uppercase tracking-widest mt-1">{settings?.addressLandmark || "Landmark: Agunlejika Bus Stop"}</p>
               </div>
               <div className="bg-charcoal p-10 rounded-[40px] border border-white/5 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-pink-500 mb-6"><Phone /></div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs">Direct Line</h4>
                   <p className="text-gray-400 text-sm hover:text-white transition-colors">
                     <a href={`tel:${settings?.companyPhone || "08131815548"}`}>
                       {settings?.companyPhone || "08131815548"}
                     </a>
                   </p>
                   <p className="text-gray-400 text-sm hover:text-white transition-colors">
                     <a href={`https://wa.me/${(settings?.companyWhatsapp || "08188341596").replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 inline-flex">
                       <MessageCircle size={14} className="text-[#25D366]" /> {settings?.companyWhatsapp || "08188341596"} <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest ml-1">(WhatsApp)</span>
                     </a>
                   </p>
               </div>
            </div>

            <div className="bg-charcoal p-10 rounded-[40px] border border-white/5">
                <div className="flex flex-wrap gap-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gold">
                         <Clock size={16} /><h4 className="text-white font-bold uppercase tracking-widest text-xs">Working Hours</h4>
                      </div>
                      <p className="text-gray-500 text-sm">{settings?.workingHoursWeekday || "Mon - Fri: 9:00 AM - 6:00 PM"}</p>
                      <p className="text-gray-500 text-sm">{settings?.workingHoursWeekend || "Sat: 10:00 AM - 4:00 PM"}</p>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-pink-500">
                         <Instagram size={16} /><h4 className="text-white font-bold uppercase tracking-widest text-xs">Socials</h4>
                      </div>
                      <p className="text-gray-500 text-sm hover:text-pink-500 transition-colors">
                         <a href="https://www.instagram.com/houseofhibba_fashion" target="_blank" rel="noopener noreferrer">
                            @{settings?.instagramHandle || "houseofhibba_fashion"}
                         </a>
                      </p>
                   </div>
                </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-charcoal p-12 rounded-[50px] border border-white/10"
          >
             <h3 className="text-3xl font-display text-white mb-10">Send an Inquiry</h3>
             <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 ml-4">Your Name</label>
                   <input type="text" className="w-full bg-[#1a1a1a] border-2 border-white/60 rounded-2xl p-6 text-white text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 ml-4">Email Address</label>
                   <input type="email" className="w-full bg-[#1a1a1a] border-2 border-white/60 rounded-2xl p-6 text-white text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all" placeholder="Enter your email address" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 ml-4">What service do you need?</label>
                   <select className="w-full bg-[#1a1a1a] border-2 border-white/60 rounded-2xl p-6 text-white text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all appearance-none">
                      <option>Ready-to-Wear</option>
                      <option>Made-to-Measure</option>
                      <option>Bridal Consultation</option>
                      <option>Fashion Training</option>
                      <option>Modest Wears</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 ml-4">Message</label>
                   <textarea rows={5} className="w-full bg-[#1a1a1a] border-2 border-white/60 rounded-2xl p-6 text-white text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" placeholder="Tell us about your requirements..."></textarea>
                </div>
                <button type="submit" className="w-full py-6 bg-gold-gradient text-black font-bold uppercase tracking-[0.3em] rounded-2xl text-[10px] shadow-2xl shadow-gold/10 hover:scale-[1.02] active:scale-95 transition-all" style={{ background: 'linear-gradient(45deg, #D4AF37, #F7E7CE)' }}>
                   Confirm Appointment
                </button>
             </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
