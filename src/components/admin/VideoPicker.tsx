import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Loader2, Film as VideoIcon, Play } from "lucide-react";
import { auth } from "../../config/firebase";
import { uploadVideoFile, validateVideo } from "../../services/videoService";

interface VideoPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function VideoPicker({ value, onChange, label = "Video" }: VideoPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const errorMsg = validateVideo(file);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("You must be logged in to upload video");
      
      const url = await uploadVideoFile(file, uid, (progress) => {
        setUploadProgress(progress);
      });
      
      onChange(url);
    } catch (error: any) {
      alert(error.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        {value && (
          <button 
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video">
          <video 
            src={value} 
            controls 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-pink-500 flex items-center gap-1">
             <VideoIcon size={12} /> Live Preview
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-2xl cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                {isUploading ? <Loader2 className="animate-spin text-pink-500" size={20} /> : <Upload size={20} />}
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300">
                {isUploading ? `${uploadProgress}% Uploaded` : "Upload Video"}
              </span>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="video/*" 
                className="hidden" 
                onChange={handleFileChange} 
                disabled={isUploading} 
              />
            </label>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-2xl cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                <LinkIcon size={20} />
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300">Paste Video URL</span>
            </button>
          </div>

          {isUploading && (
            <div className="space-y-1 bg-slate-900 p-3 rounded-xl border border-slate-800">
               <div className="flex justify-between text-[10px] font-mono text-slate-400">
                 <span>Uploading streaming media...</span>
                 <span>{uploadProgress}%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-pink-500 to-gold rounded-full transition-all duration-300" 
                   style={{ width: `${uploadProgress}%` }}
                 />
               </div>
            </div>
          )}
        </div>
      )}

      {showUrlInput && (
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 mt-2">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-pink-500/50"
              autoFocus
            />
            <button 
              type="submit"
              className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              Add URL
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
