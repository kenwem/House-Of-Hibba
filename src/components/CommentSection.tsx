import React, { useState, useEffect } from "react";
import { 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { getCommentsCollection, getSiteDoc } from "../services/firestore";
import { siteConfig } from "../config/siteConfig";
import { MessageSquare, Send, Trash2, ShieldCheck, Clock, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  collectionName: string;
  docId: string;
}

export default function CommentSection({ collectionName, docId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const colRef = getCommentsCollection(collectionName, docId);
    const q = query(colRef, orderBy("createdAt", "desc"));
    
    // Public view only shows approved comments
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(data.filter((c: any) => c.status === "approved" || c.userEmail === user?.email));
    });

    return () => unsubscribe();
  }, [collectionName, docId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const isAdmin = user.email === siteConfig.siteAdminEmail;
      await addDoc(getCommentsCollection(collectionName, docId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0],
        text: newComment,
        createdAt: serverTimestamp(),
        status: isAdmin ? "approved" : "pending"
      });
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, authorId: string) => {
    const isAdmin = user?.email === siteConfig.siteAdminEmail;
    if (!user || (user.uid !== authorId && !isAdmin)) return;

    if (window.confirm("Delete this comment?")) {
      await deleteDoc(doc(getCommentsCollection(collectionName, docId), commentId));
    }
  };

  return (
    <div className="space-y-8 mt-16 pt-16 border-t border-white/5">
      <div className="flex items-center gap-3">
        <MessageSquare className="text-pink-500" />
        <h3 className="text-2xl font-display text-white">Discussion ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Share your thoughts..." : "Please sign in to join the discussion"}
          disabled={!user || isSubmitting}
          className="w-full bg-charcoal border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 outline-none focus:border-pink-500/50 transition-all resize-none h-32"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!user || isSubmitting || !newComment.trim()}
            className="bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2 group"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-charcoal/50 border border-white/5 p-6 rounded-3xl space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
                  {comment.userName?.[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{comment.userName}</span>
                    {comment.userEmail === siteConfig.siteAdminEmail && (
                      <span className="bg-pink-500/10 text-pink-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-500/20">ADMIN</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={10} />
                    {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate()) + ' ago' : 'Just now'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {comment.status === "pending" && (
                  <div className="flex items-center gap-1 text-orange-500 text-[10px] bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                     <ShieldAlert size={12} /> Pending Moderation
                  </div>
                )}
                {(user?.uid === comment.userId || user?.email === siteConfig.siteAdminEmail) && (
                  <button 
                    onClick={() => handleDelete(comment.id, comment.userId)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed pl-13">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
