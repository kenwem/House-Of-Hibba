import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Aisha Lawal',
    role: 'Loyal Client',
    content: "House of Hibba didn't just make me a dress; they crafted a masterpiece that made me feel so confident and elegant. The attention to detail is unrivaled in Lagos.",
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=aisha'
  },
  {
    name: 'Fatima Sule',
    role: 'Bridal Client',
    content: "My bridal consultation was so seamless. They understood exactly what I wanted in a modest gown. I felt like a queen on my wedding day!",
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=fatima'
  },
  {
    name: 'Zahra Bello',
    role: 'Fashion Student',
    content: "The training program changed my life. I learned everything from pattern drafting to fabric selection. I've already started my own brand!",
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=zahra'
  },
  {
    name: 'Mariam Idris',
    role: 'Regular Customer',
    content: "The quality of their ready-to-wear abayas is exceptional. The fabric feels luxurious and the fit is always perfect.",
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=mariam'
  }
];

export default function Testimonials() {
  return (
    <div className="pt-32 bg-[#565656] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            Voices of Class
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white"
          >
            What Our <span className="text-gold">Queens</span> Say
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-6 text-lg">
            Hear from the women who have experienced the House of Hibba magic first-hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map((r, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="bg-charcoal p-12 rounded-[50px] border border-white/5 relative group hover:border-gold/20 transition-all duration-500"
             >
                <Quote className="absolute top-10 right-10 text-white/5 w-16 h-16 group-hover:text-gold/10 transition-colors" />
                <div className="flex gap-1 mb-8">
                   {[...Array(r.rating)].map((_, j) => (
                     <Star key={j} size={16} fill="#D4AF37" color="#D4AF37" />
                   ))}
                </div>
                <p className="text-gray-300 text-xl italic mb-12 leading-relaxed font-light">"{r.content}"</p>
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-full overflow-hidden border border-pink-500/20">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm">{r.name}</h4>
                      <p className="text-[10px] text-pink-500 uppercase tracking-widest">{r.role}</p>
                   </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
      
      {/* Brand Appreciation */}
      <section className="py-24 bg-gradient-to-b from-charcoal to-black">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-display text-white mb-8">Ready to share your own story?</h3>
            <p className="text-gray-500 mb-10">We would love to hear about your experience with House of Hibba.</p>
            <button className="px-10 py-4 border border-white/20 text-white rounded-full uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">Submit Feedback</button>
         </div>
      </section>
    </div>
  );
}
