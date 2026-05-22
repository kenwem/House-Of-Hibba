import React, { useState, useRef } from "react";
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  Loader2, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { motion } from "motion/react";
import { uploadImage } from "../../services/firestore";
import { auth } from "../../config/firebase";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  // Conversion metadata to show beautiful progress stats
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [stats, setStats] = useState<{
    originalSize: string;
    finalSize: string;
    savings: string;
    isHeic: boolean;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formatting byte sizes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Modern HTML5 Canvas Image Optimizer / Compressor
  const compressAndOptimize = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file); // context not supported, return original
            return;
          }

          // Max bounds (1920px is crisp and beautiful for high-res screens)
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Retain PNG transparency if needed, else output high-density JPEG
          const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const quality = 0.82; // optimized quality threshold for general screens

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              // Double compression check: if the product still exceeds 1MB, scale quality key down
              if (blob.size > 1024 * 1024) {
                canvas.toBlob(
                  (ultraBlob) => {
                    if (!ultraBlob) {
                      resolve(file);
                    } else {
                      const ultraCompressedFile = new File([ultraBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                        type: "image/jpeg",
                        lastModified: Date.now()
                      });
                      resolve(ultraCompressedFile);
                    }
                  },
                  "image/jpeg",
                  0.70 // Aggressive compression threshold
                );
              } else {
                const extension = outputType === "image/png" ? ".png" : ".jpg";
                const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + extension, {
                  type: outputType,
                  lastModified: Date.now()
                });
                resolve(optimizedFile);
              }
            },
            outputType,
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  // Process selected file
  const processAndUploadFile = async (rawFile: File) => {
    setErrorText(null);
    setStats(null);
    setIsUploading(true);
    
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        throw new Error("Log in is required to upload images");
      }

      const fileExtension = rawFile.name.split('.').pop()?.toLowerCase() || '';
      const isHeic = fileExtension === "heic" || fileExtension === "heif" || rawFile.type === "image/heic" || rawFile.type === "image/heif";
      
      let fileToUpload = rawFile;
      const originalBytes = rawFile.size;

      // 1. Process HEIC Conversion if needed
      if (isHeic) {
        setProgressStatus("Processing iPhone Apple Photo (HEIC/HEIF)...");
        try {
          // Dynamic import of heic2any
          const heic2anyModule = await import("heic2any");
          const heic2any = heic2anyModule.default;
          
          setProgressStatus("Converting HEIC to optimized JPEG...");
          const conversionResult = await (heic2any as any)({
            blob: rawFile,
            toType: "image/jpeg",
            quality: 0.85
          });

          let convertedBlob: Blob;
          if (Array.isArray(conversionResult)) {
            convertedBlob = conversionResult[0];
          } else {
            convertedBlob = conversionResult;
          }

          fileToUpload = new File([convertedBlob], rawFile.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: "image/jpeg",
            lastModified: Date.now()
          });
        } catch (heicErr: any) {
          console.error("HEIC converter error", heicErr);
          throw new Error("Failed to read HEIC format. Verify the image isn't corrupted.");
        }
      }

      // 2. Apply Custom Modern Compression & Canvas Optimization
      setProgressStatus(isHeic ? "Finalizing compression..." : "Optimizing layout & file size...");
      const compressedFile = await compressAndOptimize(fileToUpload);
      const finalBytes = compressedFile.size;

      // Ensure file matches maximum constraints (< 1MB)
      if (finalBytes > 1024 * 1024) {
        throw new Error(`The file remains too large (${formatBytes(finalBytes)}). Select a separate image.`);
      }

      // 3. Perform Live Firebase Upload
      setProgressStatus("Uploading to secure cloud storage...");
      const downloadUrl = await uploadImage(compressedFile, uid);
      
      // Calculate savings metrics
      const savingsPct = Math.max(0, Math.round(((originalBytes - finalBytes) / originalBytes) * 100));
      setStats({
        originalSize: formatBytes(originalBytes),
        finalSize: formatBytes(finalBytes),
        savings: savingsPct > 0 ? `${savingsPct}%` : "0%",
        isHeic
      });

      onChange(downloadUrl);
    } catch (err: any) {
      console.error(err);
      setErrorText(err?.message || "An unexpected error occurred during compression or upload.");
    } finally {
      setIsUploading(false);
      setProgressStatus("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput("");
      setStats(null);
      setErrorText(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon size={16} className="text-pink-500" />
          {label}
        </label>
        {value && (
          <button 
            type="button"
            onClick={() => {
              onChange("");
              setStats(null);
              setErrorText(null);
            }}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-all bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20"
          >
            <X size={12} /> Remove Image
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-xl transition-all hover:border-pink-500/40">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
             <div className="flex items-center justify-between text-white">
                <span className="text-xs font-mono truncate text-slate-300 max-w-[70%]">{value}</span>
                <span className="text-[10px] bg-pink-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Active</span>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all min-h-[180px] text-center relative ${
              dragActive 
                ? "border-pink-500 bg-pink-500/10 scale-[0.99]" 
                : "border-slate-800 bg-slate-900/40 hover:border-pink-500/40 hover:bg-slate-900/80"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.heic,.heif" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={isUploading} 
            />

            {isUploading ? (
              <div className="space-y-4 py-4">
                <Loader2 className="animate-spin text-pink-500 mx-auto" size={40} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">{progressStatus}</p>
                  <p className="text-xs text-slate-400 font-medium">Please do not close or navigate away...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto transition-all group-hover:bg-pink-500 group-hover:text-white">
                  <Upload size={22} className="text-pink-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-300">
                    Drag and drop or <span className="text-pink-500 hover:text-pink-400">browse file</span>
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    Supports HEIC (iPhone), JPG, PNG, and WebP
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-bold text-slate-400 hover:text-pink-500 inline-flex items-center gap-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-xl transition-all"
            >
              <LinkIcon size={12} />
              {showUrlInput ? "Hide External URL Input" : "Or Paste External Image URL"}
            </button>
          </div>
        </div>
      )}

      {/* Upload & Compression Statistics banner */}
      {stats && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Sparkles size={14} />
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-1">
                Image Optimized
                {stats.isHeic && <span className="text-[9px] bg-pink-600 text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold">iPhone HEIC</span>}
              </p>
              <p className="text-[10px] text-slate-400">Successfully converted & optimized</p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs font-bold text-slate-400 line-through mr-2">{stats.originalSize}</span>
            <span className="text-xs font-bold text-pink-500">{stats.finalSize}</span>
            <span className="block text-[9px] text-amber-400 font-bold uppercase tracking-wider">{stats.savings} Compressed</span>
          </div>
        </motion.div>
      )}

      {/* Graceful Inline Error Display */}
      {errorText && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl flex items-start gap-2 text-xs text-red-400"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-bold">Optimization Failed</p>
            <p className="text-[10px] leading-relaxed text-red-500/80">{errorText}</p>
          </div>
        </motion.div>
      )}

      {/* URL Input Form */}
      {showUrlInput && !value && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-slate-900 rounded-2xl border border-slate-800"
        >
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <label className="text-xs text-slate-400 font-bold tracking-wide block">Direct Image Link</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/collections/image_01.jpg"
                className="flex-grow bg-[#1a1a1a] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                disabled={!urlInput.trim()}
              >
                Hook URL
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
