import { useState, useEffect } from "react";
import { fetchData } from "../services/firestore";
import { siteConfig } from "../config/siteConfig";
import { useSettings } from "../hooks/useSettings";
import SEO from "../components/SEO";
import { Loader2, Camera, Video, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = ["All", "Bridal Outfits", "Ready-to-Wear", "Modest Wears", "Luxury Gowns"];

export default function FashionGallery() {
  const { settings, loading: settingsLoading } = useSettings();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Immersive Video Playback State
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        console.log("Fetching collections (projects) for site:", siteConfig.siteId);
        const data = await fetchData("projects", "title", "asc");
        console.log("PROJECTS DATA FETCHED:", data);
        setItems(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => (item.category || "").toLowerCase() === activeCategory.toLowerCase());

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredItems.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading || settingsLoading) return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <SEO title="Fashion Gallery & Collections" />

      {/* Banner Section */}
      <div className="relative h-[260px] flex items-center justify-center overflow-hidden">
        <img 
          src={settings?.collectionsHeroImage || "https://images.unsplash.com/photo-1539109132335-34a91bf30402?auto=format&fit=crop&q=80&w=1600"} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Collections Banner"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6">
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-pink-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
           >
             Exquisite Craftsmanship
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-7xl font-display text-white tracking-tight"
           >
             Fashion <span className="text-gold" style={{ color: '#F7E7CE' }}>Gallery</span>
           </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="text-center mb-10">
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed"
           >
             Explore our stunning collections, from timeless bridal elegance to modern modest luxury.
           </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] transition-all border ${
                activeCategory === cat 
                  ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-pink-500/50 hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, i) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-[40px] bg-charcoal border border-white/5"
              >
                {item?.video ? (
                  <video 
                    src={item.video} 
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover rounded-[40px] relative z-10"
                  />
                ) : (
                  <img 
                    src={item?.image || item?.imageUrl || "https://images.unsplash.com/photo-1539109132335-34a91bf30402?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={item?.title || "Fashion Piece"} 
                  />
                )}
                
                {/* Overlay (non-obstructive to video controls) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 pointer-events-none z-20">
                   <span className="text-pink-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">{item?.category || "Piece"}</span>
                   <h3 className="text-2xl font-display text-white mb-2">{item?.title || "Untitled Piece"}</h3>
                   {item?.description && (
                     <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
                       {item.description}
                     </p>
                   )}
                </div>

                {item?.video ? (
                  <div className="absolute top-6 right-6 w-12 h-12 bg-pink-500/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg shadow-pink-500/20 z-20">
                    <Video size={18} />
                  </div>
                ) : (
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity translate-y-4 group-hover:translate-y-0 duration-300 z-20">
                    <Camera size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Beautiful Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4 mb-20">
            <button
               disabled={currentPage === 1}
               onClick={() => {
                 setCurrentPage(prev => Math.max(prev - 1, 1));
                 window.scrollTo({ top: 400, behavior: 'smooth' });
               }}
               className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-pink-600 hover:border-pink-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                   key={idx}
                   onClick={() => {
                     setCurrentPage(idx + 1);
                     window.scrollTo({ top: 400, behavior: 'smooth' });
                   }}
                   className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${
                     currentPage === idx + 1 
                       ? "bg-pink-600 text-white border border-pink-600 shadow-lg shadow-pink-500/20" 
                       : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                   }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
               disabled={currentPage === totalPages}
               onClick={() => {
                 setCurrentPage(prev => Math.min(prev + 1, totalPages));
                 window.scrollTo({ top: 400, behavior: 'smooth' });
               }}
               className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-pink-600 hover:border-pink-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/40 uppercase tracking-widest text-xs">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Immersive Videoplayer Modal */}
      <AnimatePresence>
        {playingVideoUrl && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlayingVideoUrl(null)}
              className="absolute inset-0 cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-slate-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                 <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                   <Video size={16} className="text-pink-500" /> Fashion Showcase Stream
                 </h4>
                 <button 
                   onClick={() => setPlayingVideoUrl(null)}
                   className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                 >
                   <X size={18} />
                 </button>
              </div>
              <div className="aspect-video w-full bg-black relative">
                 <video 
                   src={playingVideoUrl} 
                   autoPlay
                   controls
                   playsInline
                   className="w-full h-full object-contain"
                 />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
