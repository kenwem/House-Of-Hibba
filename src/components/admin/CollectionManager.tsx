import React, { useState, useEffect } from "react";
import { 
  fetchData, 
  addData, 
  updateData, 
  deleteData, 
  updatePositions,
  generateSlug
} from "../../services/firestore";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  GripVertical,
  X,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ImagePicker from "./ImagePicker";
import VideoPicker from "./VideoPicker";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "image" | "video" | "select" | "boolean";
  options?: string[];
  required?: boolean;
}

interface CollectionManagerProps {
  collectionName: string;
  title: string;
  fields: Field[];
  defaultItems?: any[];
}

export default function CollectionManager({ collectionName, title, fields, defaultItems }: CollectionManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
    setCurrentPage(1);
  }, [collectionName]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchData(collectionName, "position", "asc");
      setItems(data);
    } catch (error) {
      console.error(`Error loading items for ${collectionName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!defaultItems || defaultItems.length === 0) {
      console.log("No default items to seed for", collectionName);
      return;
    }
    
    setIsSeeding(true);
    console.log(`Seeding ${defaultItems.length} items to ${collectionName}...`);
    try {
      for (const item of defaultItems) {
        await addData(collectionName, item);
      }
      console.log("Seeding complete, reloading...");
      await loadItems();
      alert(`Successfully added ${defaultItems.length} default items!`);
    } catch (error) {
      console.error("Seeding failed:", error);
      alert("Failed to seed items. Check console for details.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      const initialData = fields.reduce((acc: any, field) => {
        acc[field.name] = field.type === "boolean" ? false : "";
        return acc;
      }, {});
      setFormData({ ...initialData, position: items.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const finalData = { ...formData };
      
      // Auto-generate slug if title exists and slug doesn't
      if ((finalData.title || finalData.name) && !finalData.slug) {
        finalData.slug = generateSlug(finalData.title || finalData.name);
      }

      // Ensure no undefined fields are sent to Firestore
      const cleanData = Object.keys(finalData).reduce((acc: any, key) => {
        if (finalData[key] !== undefined) {
          acc[key] = finalData[key];
        }
        return acc;
      }, {});

      console.log(`Saving to ${collectionName}:`, cleanData);

      if (editingItem) {
        await updateData(collectionName, editingItem.id, cleanData);
      } else {
        await addData(collectionName, cleanData);
      }
      
      console.log("Save successful, reloading items...");
      await loadItems();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredItems = items.filter(item => 
    Object.values(item).some(val => 
      (String(val || "")).toLowerCase().includes((search || "").toLowerCase())
    )
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your {title.toLowerCase()} collection</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-pink-500/10"
        >
          <Plus size={20} /> Add New {title.slice(0, -1)}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-pink-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-grow md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-700 transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table/Grid */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-pink-500" size={40} />
            <p className="text-slate-500 animate-pulse">Loading {title.toLowerCase()}...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-20 text-center space-y-6">
            <p className="text-slate-500">No items found.</p>
            {defaultItems && defaultItems.length > 0 && (
              <div className="pt-4 border-t border-slate-800/50 max-w-sm mx-auto">
                <p className="text-xs text-slate-600 mb-6">Would you like to populate this collection with the already listed items from the live page?</p>
                <button 
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="bg-slate-800 hover:bg-slate-700 text-gold font-bold px-6 py-3 rounded-xl border border-gold/20 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Seed Already Listed Items
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Pos</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Preview</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-slate-700" />
                        <span className="font-mono text-sm text-slate-400">{item.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.image || item.imageUrl ? (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden">
                          <img src={item.image || item.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600">
                           —
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white leading-none">{item.title || item.name || "Untitled"}</h4>
                        <p className="text-xs text-slate-500 max-w-xs truncate">{item.subtitle || item.description || ""}</p>
                        <div className="flex flex-wrap gap-2 items-center">
                           {item.price && <span className="text-gold font-bold">{item.price}</span>}
                           {item.duration && <span className="text-slate-500">• {item.duration}</span>}
                           {item.category && <span className="text-pink-500/80">• {item.category}</span>}
                           {item.video && <span className="text-[9px] bg-pink-505/10 bg-pink-500/10 text-pink-400 border border-pink-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold">Video Link Attached</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Showing {paginatedItems.length} of {filteredItems.length} items
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-50 hover:bg-slate-800 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
               {Array.from({ length: totalPages }).map((_, idx) => (
                 <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === idx + 1 ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-500 hover:bg-slate-800 border border-slate-800'
                    }`}
                 >
                   {idx + 1}
                 </button>
               ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-50 hover:bg-slate-800 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
                <h2 className="text-xl font-bold text-white">
                  {editingItem ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}
                </h2>
                <button onClick={handleCloseModal} className="text-slate-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                      {field.type === "image" ? (
                        <ImagePicker 
                          value={formData[field.name]} 
                          onChange={(url) => handleChange(field.name, url)}
                          label={field.label}
                        />
                      ) : field.type === "video" ? (
                        <VideoPicker 
                          value={formData[field.name]} 
                          onChange={(url) => handleChange(field.name, url)}
                          label={field.label}
                        />
                      ) : field.type === "textarea" ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">{field.label}</label>
                          <textarea 
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            required={field.required}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none transition-all resize-none"
                          />
                        </div>
                      ) : field.type === "select" ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">{field.label}</label>
                          <select 
                             value={formData[field.name] || ""}
                             onChange={(e) => handleChange(field.name, e.target.value)}
                             required={field.required}
                             className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none transition-all"
                          >
                             <option value="">Select {field.label}</option>
                             {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      ) : field.type === "boolean" ? (
                        <div className="flex items-center gap-3 py-2">
                           <input 
                              type="checkbox"
                              checked={formData[field.name] || false}
                              onChange={(e) => handleChange(field.name, e.target.checked)}
                              className="w-5 h-5 accent-pink-600 rounded cursor-pointer"
                           />
                           <label className="text-sm font-medium text-slate-400">{field.label}</label>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">{field.label}</label>
                          <input 
                            type={field.type === "number" ? "number" : "text"}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
                            required={field.required}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none transition-all"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Position (Numeric)</label>
                    <input 
                      type="number"
                      value={formData.position || 0}
                      onChange={(e) => handleChange("position", Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-pink-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex gap-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-grow bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-grow bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingItem ? "Update Changes" : "Save Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Confirmation</h3>
              <p className="text-slate-400 text-sm mb-6">Are you sure you want to delete this item? This action is permanent and cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = itemToDelete;
                    setItemToDelete(null);
                    try {
                      await deleteData(collectionName, id);
                      await loadItems();
                    } catch (error) {
                      console.error(error);
                      alert("Failed to delete item.");
                    }
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all cursor-pointer"
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
