import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Trash2, 
  Edit, 
  UploadCloud, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Film,
  Save,
  Play
} from "lucide-react";
import { auth } from "../../config/firebase";
import { 
  uploadVideoFile, 
  saveVideoDoc, 
  deleteVideoDoc, 
  updateVideoMeta, 
  listenToVideos, 
  VideoDoc 
} from "../../services/videoService";
import { motion, AnimatePresence } from "motion/react";

export default function VideoManager() {
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload States
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "failed">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit States
  const [editingVideo, setEditingVideo] = useState<VideoDoc | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<VideoDoc | null>(null);

  // Drag and drop State
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Listen to real-time additions/removals of siteE videos
    const unsubscribe = listenToVideos(
      (data) => {
        setVideos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Realtime videos listen error:", err);
        setError("Could not load videos. Please check your credentials.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadError(null);
    setUploadStatus("idle");

    if (!file.type.startsWith("video/")) {
      const msg = "Invalid file type. Only files of type video/* are allowed.";
      setUploadError(msg);
      alert(msg);
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      const msg = "Image size must be less than 1MB | Video size must be less than 50MB";
      setUploadError(msg);
      alert(msg);
      return;
    }

    setRawFile(file);
    // Use clear name as default title
    const prettyName = file.name
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[_-]+/g, " "); // replace underscores/dashes with spaces
    setTitleInput(prettyName);
  };

  const clearSelection = () => {
    setRawFile(null);
    setTitleInput("");
    setDescInput("");
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawFile) return;

    const user = auth.currentUser;
    if (!user) {
      alert("You must be authenticated to upload videos.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadError(null);

    try {
      // 1. Upload video to storage
      const downloadURL = await uploadVideoFile(rawFile, user.uid, (progress) => {
        setUploadProgress(progress);
      });

      // 2. Save document to firestore
      await saveVideoDoc(downloadURL, titleInput, descInput, user.uid);

      setUploadStatus("success");
      // Clear inputs for next upload after a brief successful state display
      setTimeout(() => {
        clearSelection();
        setIsUploading(false);
      }, 1500);
    } catch (err: any) {
      console.error("Upload process failed:", err);
      setUploadStatus("failed");
      setUploadError(err?.message || "Internal folder upload error.");
      setIsUploading(false);
    }
  };

  const handleDelete = async (vid: VideoDoc) => {
    setVideoToDelete(vid);
  };

  const startEdit = (vid: VideoDoc) => {
    setEditingVideo(vid);
    setEditTitle(vid.title);
    setEditDesc(vid.description);
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setEditTitle("");
    setEditDesc("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo?.id) return;

    setIsSavingEdit(true);
    try {
      await updateVideoMeta(editingVideo.id, editTitle, editDesc);
      setEditingVideo(null);
    } catch (err: any) {
      alert(`Failed to save changes: ${err?.message || err}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-3">
             <Film className="text-pink-500" /> Fashion Videos Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            SiteE Modest Wear video showcase controller. Up to 50MB isolated files.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-950/80 rounded-xl border border-white/5 text-xs text-gold font-mono uppercase tracking-widest">
           Site ID: siteE (Isolated)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Upload Box */}
        <div className="lg:col-span- così lg:col-span-5 space-y-6">
           <div className="bg-[#121212] border border-white/5 p-6 rounded-[24px] shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <UploadCloud size={18} className="text-pink-500" /> New Video Upload
              </h2>

              <form onSubmit={handleUpload} className="space-y-6">
                 {/* Drag & Drop Area */}
                 {!rawFile ? (
                   <div 
                     onDragEnter={handleDrag}
                     onDragOver={handleDrag}
                     onDragLeave={handleDrag}
                     onDrop={handleDrop}
                     onClick={() => fileInputRef.current?.click()}
                     className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                       isDragActive 
                         ? "border-pink-500 bg-pink-500/5 text-white" 
                         : "border-white/10 hover:border-pink-500/50 hover:bg-white/[0.02]"
                     }`}
                   >
                     <input 
                       type="file" 
                       ref={fileInputRef}
                       onChange={handleFileInput}
                       accept="video/*" 
                       className="hidden" 
                     />
                     <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 text-pink-400">
                        <Video size={24} />
                     </div>
                     <span className="text-sm font-semibold block text-slate-200">
                        Drag and drop video here
                     </span>
                     <span className="text-xs text-slate-500 mt-1 block">
                        or click to browse your system (max 50MB)
                     </span>
                   </div>
                 ) : (
                   <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-4">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 min-w-0">
                         <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
                           <Video size={18} />
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{rawFile.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {(rawFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                         </div>
                       </div>
                       <button 
                         type="button"
                         onClick={clearSelection}
                         disabled={isUploading}
                         className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                       >
                         <X size={16} />
                       </button>
                     </div>

                     {/* Progress details */}
                     {isUploading && (
                       <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-mono text-slate-400">
                           <span>{uploadStatus === "uploading" ? `Uploading... ${uploadProgress}%` : uploadStatus.toUpperCase()}</span>
                           <span>{(rawFile.size * (uploadProgress/100) / (1024 * 1024)).toFixed(2)} / {(rawFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-gradient-to-r from-pink-500 to-gold rounded-full transition-all duration-300" 
                             style={{ width: `${uploadProgress}%` }}
                           />
                         </div>
                       </div>
                     )}

                     {/* Success state info */}
                     {uploadStatus === "success" && (
                       <div className="flex items-center gap-2 text-emerald-400 text-xs py-1">
                          <CheckCircle size={16} /> File uploaded & referenced instantly!
                       </div>
                     )}

                     {/* Fail state info */}
                     {uploadStatus === "failed" && (
                       <div className="flex items-center gap-2 text-red-400 text-xs py-1">
                          <AlertCircle size={16} /> {uploadError || "Upload failed."}
                       </div>
                     )}
                   </div>
                 )}

                 {/* Video Metadata Inputs */}
                 {rawFile && (
                   <div className="space-y-4">
                     <div className="space-y-1">
                       <label className="text-[10px] uppercase tracking-widest text-slate-400">Video Title</label>
                       <input 
                         type="text" 
                         required
                         disabled={isUploading}
                         value={titleInput}
                         onChange={(e) => setTitleInput(e.target.value)}
                         placeholder="E.g., Bridal Gown Backstage"
                         className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-pink-500/50 transition-colors"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] uppercase tracking-widest text-slate-400">Description</label>
                       <textarea 
                         rows={3}
                         disabled={isUploading}
                         value={descInput}
                         onChange={(e) => setDescInput(e.target.value)}
                         placeholder="Tell the client about this gown or collection..."
                         className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-pink-500/50 transition-colors resize-none"
                       />
                     </div>

                     <button
                       type="submit"
                       disabled={isUploading || !titleInput.trim()}
                       className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                     >
                       {isUploading ? (
                         <>
                           <Loader2 size={16} className="animate-spin" /> Uploading Video...
                         </>
                       ) : (
                         "Start Video Upload"
                       )}
                     </button>
                   </div>
                 )}
              </form>
           </div>
        </div>

        {/* Right Hand: Video Grid Container */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121212] border border-white/5 p-6 rounded-[24px] shadow-2xl min-h-[400px]">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Video size={18} className="text-gold" /> Uploaded Showcase Layouts
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                <Loader2 size={36} className="animate-spin text-pink-500" />
                <span className="text-xs uppercase tracking-widest font-mono">Syncing database...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-400 border border-red-500/10 rounded-2xl bg-red-500/5 px-6">
                <AlertCircle className="mx-auto mb-3" size={32} />
                <p className="text-sm">{error}</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 text-center border-2 border-dashed border-white/5 rounded-2xl">
                 <Video size={40} className="mb-4" />
                 <p className="text-sm font-semibold">No Modest Showcases uploaded yet</p>
                 <p className="text-xs text-slate-500 max-w-xs mt-1">
                   Select video files on the left menu to push streaming elements immediately to siteE collections page.
                 </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                 {videos.map((vid) => (
                   <div 
                     key={vid.id} 
                     className="bg-charcoal border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 hover:border-white/10 transition-colors group"
                   >
                     {/* Video Player */}
                     <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-black flex-shrink-0 relative">
                        <video 
                          src={vid.videoUrl} 
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                     </div>

                     {/* Meta and actions */}
                     <div className="flex-grow flex flex-col justify-between py-1 min-w-0">
                       <div className="min-w-0">
                         <div className="flex items-start justify-between gap-3">
                           <h3 className="font-bold text-white uppercase tracking-wider text-sm truncate">
                             {vid.title}
                           </h3>
                           <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button
                               onClick={() => startEdit(vid)}
                               className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                               title="Edit Title & Description"
                             >
                               <Edit size={16} />
                             </button>
                             <button
                               onClick={() => handleDelete(vid)}
                               className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                               title="Delete Video"
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>
                         </div>
                         <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                           {vid.description || "No description set."}
                         </p>
                       </div>
                       
                       <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3">
                         <span>Created: {vid.createdAt?.seconds ? new Date(vid.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}</span>
                         <span className="text-[9px] bg-slate-900 border border-white/5 px-2.5 py-0.5 rounded-full text-pink-500 font-bold uppercase tracking-widest text-[8px]">
                           SiteE Isolated
                         </span>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Metadata Modal */}
      <AnimatePresence>
        {editingVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-[#121212] border border-white/10 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl"
             >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                   <h3 className="text-md uppercase tracking-widest font-bold text-white flex items-center gap-2">
                     <Edit size={18} className="text-pink-500" /> Modify Master Metadata
                   </h3>
                   <button 
                     onClick={cancelEdit}
                     className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                   >
                     <X size={18} />
                   </button>
                </div>

                <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                   <div className="space-y-1">
                     <label className="text-[10px] uppercase tracking-widest text-slate-400">Video Title</label>
                     <input 
                       type="text" 
                       required
                       value={editTitle}
                       onChange={(e) => setEditTitle(e.target.value)}
                       className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-pink-500/50 transition-colors"
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] uppercase tracking-widest text-slate-400">Description</label>
                     <textarea 
                       rows={4}
                       value={editDesc}
                       onChange={(e) => setEditDesc(e.target.value)}
                       className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-pink-500/50 transition-colors resize-none"
                     />
                   </div>

                   <div className="flex gap-4 pt-4">
                     <button
                       type="button"
                       onClick={cancelEdit}
                       className="flex-1 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-colors"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       disabled={isSavingEdit || !editTitle.trim()}
                       className="flex-1 py-3 bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40 rounded-xl text-xs uppercase tracking-widest font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                     >
                       {isSavingEdit ? (
                         <>
                           <Loader2 size={14} className="animate-spin" /> Saving...
                         </>
                       ) : (
                         <>
                           <Save size={14} /> Keep Metadata
                         </>
                       )}
                     </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {videoToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-[#121212] border border-white/10 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl text-center p-6"
             >
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Trash2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Video</h3>
                <p className="text-slate-400 text-sm mb-6 font-medium">Are you sure you want to delete "{videoToDelete.title}"? This will permanently remove the showcase.</p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setVideoToDelete(null)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const id = videoToDelete.id;
                      const url = videoToDelete.videoUrl;
                      setVideoToDelete(null);
                      if (!id) return;
                      try {
                        await deleteVideoDoc(id, url);
                      } catch (err: any) {
                        alert(`Failed to delete video: ${err?.message || err}`);
                      }
                    }}
                    className="flex-grow bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer py-3"
                  >
                    Delete Permanently
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
