import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Award, Users, BookOpen, Scissors, Loader2, Video, Play, X, Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { fetchData, addData } from '../services/firestore';
import { useSettings } from '../hooks/useSettings';
import { DEFAULT_TRAININGS } from '../config/defaults';

export default function Trainings() {
  const { settings, loading: settingsLoading } = useSettings();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    program: "",
    startDate: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEnrollClick = (programTitle: string) => {
    setEnrollForm({
      fullName: "",
      email: "",
      phone: "",
      program: programTitle,
      startDate: "",
      message: ""
    });
    setIsSuccess(false);
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.fullName || !enrollForm.email || !enrollForm.phone || !enrollForm.program || !enrollForm.startDate) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addData("enrollments", {
        fullName: enrollForm.fullName,
        email: enrollForm.email,
        phone: enrollForm.phone,
        program: enrollForm.program,
        startDate: enrollForm.startDate,
        message: enrollForm.message,
        status: "pending",
        source: "academy"
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting enrollment:", err);
      alert("There was an error saving your enrollment. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadTrainings = async () => {
      try {
        const data = await fetchData("trainings", "title", "asc");
        if (data && data.length > 0) {
          setTrainings(data);
        } else {
          setTrainings(DEFAULT_TRAININGS);
        }
      } catch (error) {
        console.error(error);
        setTrainings(DEFAULT_TRAININGS);
      } finally {
        setLoading(false);
      }
    };
    loadTrainings();
  }, []);

  if (loading || settingsLoading) return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentTrainings = trainings.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(trainings.length / itemsPerPage);

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white">
      {/* Banner Section */}
      <div className="relative h-[260px] flex items-center justify-center overflow-hidden">
        <img 
          src={settings?.trainingsHeroImage || "https://images.unsplash.com/photo-1524311583145-d419616d2524?auto=format&fit=crop&q=80&w=1600"} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Trainings Banner"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6">
           <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            Professional Excellence
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white"
          >
            Fashion <span className="text-gold" style={{ color: '#D4AF37' }}>Academy</span>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-pink-500 font-extrabold uppercase tracking-[0.3em] text-[11px] mb-3 block"
          >
            Premium Academy Programs
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white tracking-tight mb-4"
          >
            Fashion Business & Creative Mastery
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base leading-relaxed mb-8"
          >
            Unlock your creative potential and master the craft of professional fashion design with our expert-led, international design programs.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onClick={() => handleEnrollClick(trainings[0]?.title || "")}
            className="inline-flex items-center gap-2 px-10 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full uppercase tracking-widest text-[10px] transition-all shadow-md shadow-pink-500/20 cursor-pointer"
          >
            Enroll Now
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-10">
          {currentTrainings.map((t, i) => {
             const globalIndex = firstIndex + i;
             return (
               <motion.div 
                 key={t.id || t.title}
                 initial={{ opacity: 0, y: 25 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(219,39,119,0.05)] hover:-translate-y-2 transition-all duration-500 flex flex-col group h-full relative"
               >
                  <div className="w-12 h-12 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-center text-pink-600 mb-5 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                    {globalIndex === 0 ? <Scissors size={20} /> : globalIndex === 1 ? <BookOpen size={20} /> : globalIndex === 2 ? <Award size={20} /> : <Users size={20} />}
                  </div>
                  <h3 className="text-xl md:text-2xl font-display text-slate-900 font-bold mb-3 tracking-tight group-hover:text-pink-600 transition-colors duration-300">{t.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm mb-4 flex-grow">{t.description}</p>
                  
                  {t.video && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 shadow-sm mb-4">
                       <video 
                         src={t.video} 
                         controls
                         playsInline
                         preload="metadata"
                         className="w-full h-full object-cover"
                       />
                    </div>
                  )}
                  
                  <div className="space-y-3 pt-5 border-t border-slate-100">
                     <div className="flex items-center gap-3 text-xs">
                        <Clock size={16} className="text-pink-500" />
                        <span className="text-slate-400 uppercase tracking-widest font-semibold font-mono text-[10px]">Duration:</span>
                        <span className="text-slate-800 font-bold">{t.duration || "TBA"}</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs">
                        <Award size={16} className="text-amber-500" />
                        <span className="text-slate-400 uppercase tracking-widest font-semibold font-mono text-[10px]">Fee:</span>
                        <span className="text-pink-600 font-bold text-sm">{t.price || "TBA"}</span>
                     </div>
                     <div className="flex flex-col gap-1 pt-2 items-start text-xs border-t border-slate-100/60 mt-1">
                         <span className="text-slate-400 uppercase tracking-[.2em] font-bold text-[9px] font-mono">Class Structure</span>
                         <span className="text-slate-600 font-medium italic">{t.structure || "Enroll for details"}</span>
                     </div>
                     <button 
                       onClick={() => handleEnrollClick(t.title)}
                       className="w-full mt-3 py-3 bg-slate-950 hover:bg-pink-600 text-white hover:text-white uppercase tracking-widest font-bold rounded-xl text-[10px] transition-all duration-300 shadow-sm shadow-slate-950/10 cursor-pointer"
                     >
                       Apply Now
                     </button>
                  </div>
               </motion.div>
             );
          })}
        </div>

        {/* Beautiful Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8 mb-16">
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

         <div className="bg-slate-950 rounded-[48px] p-12 md:p-16 border border-slate-900 relative overflow-hidden shadow-xl max-w-6xl mx-auto mt-24">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-500/5 blur-[120px] pointer-events-none" />
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl md:text-5xl font-display text-white mb-6 font-black tracking-tight leading-tight">Ready to start your fashion empire?</h2>
                 <div className="flex gap-4 mt-8">
                    <button 
                      onClick={() => handleEnrollClick("")}
                      className="px-10 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full uppercase tracking-widest text-[10px] transition-colors shadow-lg shadow-pink-500/10 cursor-pointer"
                    >
                      Enroll Now
                    </button>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                    <Clock className="text-pink-500 mb-4" />
                    <span className="text-xl font-display text-white block font-bold">3 - 6 Months</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Training Duration</span>
                 </div>
                 <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/5 mt-6">
                    <Award className="text-amber-500 mb-4" />
                    <span className="text-xl font-display text-white block font-bold">Certified</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Industry Recognized</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Enroll Form Pop-up Modal */}
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnrollModal(false)}
              className="absolute inset-0 cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white text-slate-900 border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Nice ambient brand accent bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-pink-600 to-amber-400" />
              
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <span className="text-pink-600 font-extrabold uppercase tracking-[0.2em] text-[9px] block mb-1">Academy Enrollment</span>
                    <h3 className="text-2.5xl font-display font-black tracking-tight text-slate-900">Start Your Journey</h3>
                 </div>
                 <button 
                   onClick={() => setShowEnrollModal(false)}
                   className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                 >
                   <X size={18} />
                 </button>
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                     <Award size={40} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-bold font-display text-slate-900">Application Submitted!</h4>
                     <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                       Thank you, <strong>{enrollForm.fullName}</strong>. We've received your application for <strong>{enrollForm.program}</strong>. Our academy coordinator will reach you via email or phone shortly.
                     </p>
                  </div>
                  <button 
                    onClick={() => setShowEnrollModal(false)}
                    className="px-8 py-3 bg-slate-900 hover:bg-pink-600 text-white uppercase tracking-widest font-mono font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-md"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-5">
                   {/* Full Name */}
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Full Name *</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                         <input 
                           type="text" 
                           required
                           value={enrollForm.fullName}
                           onChange={(e) => setEnrollForm({...enrollForm, fullName: e.target.value})}
                           className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-4 text-slate-800 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all font-medium" 
                           placeholder="Enter your name" 
                         />
                      </div>
                   </div>

                   {/* Email */}
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Email Address *</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                         <input 
                           type="email" 
                           required
                           value={enrollForm.email}
                           onChange={(e) => setEnrollForm({...enrollForm, email: e.target.value})}
                           className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-4 text-slate-800 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all font-medium" 
                           placeholder="aisha@example.com" 
                         />
                      </div>
                   </div>

                   {/* Phone */}
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Phone Number *</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                         <input 
                           type="tel" 
                           required
                           value={enrollForm.phone}
                           onChange={(e) => setEnrollForm({...enrollForm, phone: e.target.value})}
                           className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-4 text-slate-800 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all font-medium" 
                           placeholder="e.g. 08012345678" 
                         />
                      </div>
                   </div>

                   {/* Program Select */}
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Preferred Course *</label>
                      <select 
                        required
                        value={enrollForm.program}
                        onChange={(e) => setEnrollForm({...enrollForm, program: e.target.value})}
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl py-3 px-4 text-slate-800 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all font-medium appearance-none"
                      >
                         <option value="" disabled>-- Select academic path --</option>
                         {trainings.map(t => (
                            <option key={t.id || t.title} value={t.title}>{t.title}</option>
                         ))}
                         <option value="General Fashion Design">General Fashion Design & Styling</option>
                      </select>
                   </div>

                   {/* Class Start Date */}
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Preferred Start Date (dd/mm/yyyy) *</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Calendar size={14} /></span>
                         <input 
                           type="date" 
                           required
                           value={enrollForm.startDate}
                           onChange={(e) => setEnrollForm({...enrollForm, startDate: e.target.value})}
                           className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-4 text-slate-800 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all font-medium select-none" 
                         />
                      </div>
                   </div>

                   {/* Message */}
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Additional Notes (Optional)</label>
                      <div className="relative">
                         <span className="absolute left-4 top-5 text-slate-400"><MessageSquare size={14} /></span>
                         <textarea 
                           rows={3}
                           value={enrollForm.message}
                           onChange={(e) => setEnrollForm({...enrollForm, message: e.target.value})}
                           className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-4 text-slate-800 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all font-medium" 
                           placeholder="Any custom requests or schedule preferences..." 
                         />
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 text-white font-bold uppercase tracking-widest rounded-xl text-xs transition-colors shadow-md shadow-pink-500/10 cursor-pointer flex items-center justify-center gap-2"
                   >
                     {isSubmitting ? (
                       <>
                         <Loader2 className="animate-spin" size={16} /> Submitting...
                       </>
                     ) : "Complete Registration"}
                   </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                   <Video size={16} className="text-pink-500" /> Academy Lecture Intro
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
