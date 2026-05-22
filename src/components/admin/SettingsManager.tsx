import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoc, updateData, getSiteDoc } from "../../services/firestore";
import { 
  Save, 
  Loader2, 
  Info, 
  Share2, 
  Search, 
  Smartphone, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Scissors, 
  FileText,
  Image as ImageIcon
} from "lucide-react";
import ImagePicker from "./ImagePicker";
import VideoPicker from "./VideoPicker";
import { doc, getDoc, setDoc as firestoreSetDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { siteConfig } from "../../config/siteConfig";

export default function SettingsManager() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchDoc("settings", "general");
      const defaults = {
        heroTitle: "Elegant | Modest",
        heroSubtitle: "for the Classy Woman",
        heroVideo: "",
        companyName: "House of Hibba",
        companyEmail: siteConfig.companyEmail,
        companyPhone: siteConfig.companyPhone,
        companyWhatsapp: siteConfig.companyWhatsapp,
        companyAddress: "221 Ijesha Road, Surulere, Lagos.",
        addressLandmark: "Agunlejika Bus Stop",
        workingHoursWeekday: "Mon - Fri: 9:00 AM - 6:00 PM",
        workingHoursWeekend: "Sat: 10:00 AM - 4:00 PM",
        instagramHandle: "houseofhibba_fashion",
        instagram: "",
        facebook: "",
        twitter: "",
        website: "",
        metaTitle: "House of Hibba | Premium Modest Outfits",
        metaDescription: "We create premium modest outfits that inspire confidence, beauty, and sophistication.",
        footerText: "Dream Big, Style Perfectly",
        footerCopyright: `© ${new Date().getFullYear()} House of Hibba. All rights reserved.`,
        logo: "",
        aboutTagline: "Where Modesty Meets",
        aboutTaglineGold: "Unrivaled Luxury",
        aboutText: "Houseofhibba Fashion is a modest fashion brand focused on creating elegant, stylish, and well-tailored outfits for women. The brand also offers fashion training for individuals interested in learning sewing, pattern drafting, and modest wear production.",
        aboutImage: "https://images.unsplash.com/photo-1574701148212-8518049c7b2c?auto=format&fit=crop&q=80&w=800",
        aboutStoryTitle: "The House of Hibba Story",
        aboutStorySubtitle: "Our Heritage",
        aboutStoryText1: "To become a globally recognized modest fashion brand known for creativity, quality, and excellence in fashion training.",
        aboutStoryText2: "To empower women through fashion by creating modest outfits and equipping aspiring fashion designers with practical sewing skills and creativity.",
        aboutQuote: "Fashion is not just about what you wear, it's about how you feel. We style your dreams perfectly.",
        aboutSideImage: "https://images.unsplash.com/photo-1561822713-da02f57225b2?w=500&auto=format&fit=crop&q=60",
        aboutHeroImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600",
        collectionsHeroImage: "https://images.unsplash.com/photo-1539109132335-34a91bf30402?auto=format&fit=crop&q=80&w=1600",
        trainingsHeroImage: "https://images.unsplash.com/photo-1524311583145-d419616d2524?auto=format&fit=crop&q=80&w=1600",
        servicesHeroImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600",
        contactHeroImage: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=1600",
      };

      if (data) {
        setSettings({ ...defaults, ...data });
      } else {
        setSettings(defaults);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? ({ ...prev, [name]: value }) : prev);
  };

  const handleImageChange = (name: string, url: string) => {
    setSettings(prev => prev ? ({ ...prev, [name]: url }) : prev);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = getSiteDoc("settings", "general");
      await firestoreSetDoc(docRef, settings);
      alert("Settings updated successfully!");
      navigate("/admin"); // Close/navigate back on success
    } catch (error) {
      console.error(error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin text-pink-500" size={40} />
      <p className="text-slate-500">Loading settings...</p>
    </div>
  );

  const tabs = [
    { id: "general", name: "General Info", icon: Info },
    { id: "hero", name: "Hero Section", icon: Smartphone },
    { id: "philosophy", name: "Philosophy Section", icon: Scissors },
    { id: "about_page", name: "About Page", icon: Info },
    { id: "banners", name: "Page Banners", icon: ImageIcon },
    { id: "contact", name: "Contact & Location", icon: Phone },
    { id: "social", name: "Social Links", icon: Share2 },
    { id: "seo", name: "SEO & Meta", icon: Search },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">General Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your website's global information and identity</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row h-[750px]">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/30 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? "bg-pink-500/10 text-pink-500 border border-pink-500/20" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <tab.icon size={18} />
                <span className="font-bold text-sm">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="flex-grow p-8 overflow-y-auto space-y-8 scrollbar-hide font-sans">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Company Name</label>
                      <input name="companyName" value={settings.companyName || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Footer Copyright</label>
                      <input name="footerCopyright" value={settings.footerCopyright || ""} onChange={handleChange} placeholder="© 2024 Hibba Fashion" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                   </div>
                   <div className="space-y-2 text-right">
                      <ImagePicker label="Website Logo" value={settings.logo} onChange={(url) => handleImageChange("logo", url)} />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">Footer Tagline</label>
                   <input name="footerText" value={settings.footerText || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                </div>
              </div>
            )}

            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">Hero Main Title (Use | for part with different color)</label>
                   <input name="heroTitle" value={settings.heroTitle || ""} onChange={handleChange} placeholder="Elegant | Modest" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">Hero Subtitle</label>
                 </div>
                 <div className="space-y-2 col-span-2">
                    <VideoPicker label="Hero Video Background / Loop (Optional)" value={settings.heroVideo || ""} onChange={(url) => handleImageChange("heroVideo", url)} />
                 </div>
                 <div className="space-y-2">
                   <input name="heroSubtitle" value={settings.heroSubtitle || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <ImagePicker label="Hero Desktop Image" value={settings.heroImageDesktop} onChange={(url) => handleImageChange("heroImageDesktop", url)} />
                   <ImagePicker label="Hero Mobile Image" value={settings.heroImageMobile} onChange={(url) => handleImageChange("heroImageMobile", url)} />
                </div>
              </div>
            )}

            {activeTab === "philosophy" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400">Philosophy Tagline (Normal Part)</label>
                       <input name="aboutTagline" value={settings.aboutTagline || ""} onChange={handleChange} placeholder="Where Modesty Meets" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400 text-gold-500">Philosophy Tagline (Gold Part)</label>
                       <input name="aboutTaglineGold" value={settings.aboutTaglineGold || ""} onChange={handleChange} placeholder="Unrivaled Luxury" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400">Philosophy Description</label>
                       <textarea name="aboutText" rows={5} value={settings.aboutText || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none resize-none" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                     <ImagePicker label="Philosophy Image" value={settings.aboutImage} onChange={(url) => handleImageChange("aboutImage", url)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about_page" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400">Story Title</label>
                       <input name="aboutStoryTitle" value={settings.aboutStoryTitle || ""} onChange={handleChange} placeholder="The House of Hibba Story" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400">Story Subtitle</label>
                       <input name="aboutStorySubtitle" value={settings.aboutStorySubtitle || ""} onChange={handleChange} placeholder="Our Heritage" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400">Vision Text</label>
                       <textarea name="aboutStoryText1" rows={4} value={settings.aboutStoryText1 || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none resize-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400">Mission Text</label>
                       <textarea name="aboutStoryText2" rows={4} value={settings.aboutStoryText2 || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none resize-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-400 italic">About Page Quote</label>
                       <textarea name="aboutQuote" rows={3} value={settings.aboutQuote || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none resize-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                     <ImagePicker label="About Side Image (Middle of page)" value={settings.aboutSideImage} onChange={(url) => handleImageChange("aboutSideImage", url)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "banners" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <ImagePicker label="About Page Banner" value={settings.aboutHeroImage} onChange={(url) => handleImageChange("aboutHeroImage", url)} />
                   <ImagePicker label="Collections Page Banner" value={settings.collectionsHeroImage} onChange={(url) => handleImageChange("collectionsHeroImage", url)} />
                   <ImagePicker label="Trainings Page Banner" value={settings.trainingsHeroImage} onChange={(url) => handleImageChange("trainingsHeroImage", url)} />
                   <ImagePicker label="Contact Page Banner" value={settings.contactHeroImage} onChange={(url) => handleImageChange("contactHeroImage", url)} />
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><Mail size={14}/> Email</label>
                    <input name="companyEmail" value={settings.companyEmail || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><Phone size={14}/> Phone</label>
                    <input name="companyPhone" value={settings.companyPhone || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2 text-green-500"><Phone size={14}/> WhatsApp</label>
                    <input name="companyWhatsapp" value={settings.companyWhatsapp || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><MapPin size={14}/> Office Address</label>
                    <input name="companyAddress" value={settings.companyAddress || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><MapPin size={14}/> Address Landmark</label>
                    <input name="addressLandmark" value={settings.addressLandmark || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Instagram", "Facebook", "Twitter", "Website"].map(social => (
                    <div className="space-y-2" key={social}>
                       <label className="text-sm font-medium text-slate-400">{social} URL</label>
                       <input name={social.toLowerCase()} value={settings[social.toLowerCase()] || ""} onChange={handleChange} placeholder={`https://${social.toLowerCase()}.com/username`} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Meta Title Default</label>
                  <input name="metaTitle" value={settings.metaTitle || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Meta Description Default</label>
                  <textarea name="metaDescription" rows={4} value={settings.metaDescription || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">CTA Title</label>
                      <input name="ctaTitle" value={settings.ctaTitle || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">CTA Subtitle</label>
                      <input name="ctaSubtitle" value={settings.ctaSubtitle || ""} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none" />
                   </div>
                </div>
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-4">
                  <Info className="text-blue-500 flex-shrink-0" size={24} />
                  <p className="text-xs text-blue-300 leading-relaxed">
                    These values are used as defaults across your website when specific page metadata is not present. Professional SEO helps your site rank better on Google.
                  </p>
                </div>
              </div>
            )}

            {/* Sticky Save Button inside Form */}
            <div className="pt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-pink-500/20 flex items-center justify-center gap-3"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save All Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
