import React, { useState } from "react";
import { X, Clock, Sparkles } from "lucide-react";
import { suggestTaskDescription } from "../services/geminiService";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, dueDate?: string) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setAiError("");
    onClose();
  };

  if (!isOpen) return null;

  const handleAiSuggest = async () => {
    if (!title.trim()) return;
    setIsAiEnhancing(true);
    setAiError("");
    try {
      const suggestion = await suggestTaskDescription(title);
      setDescription(suggestion);
    } catch (err: any) {
      setAiError(err?.message || "AI suggestion failed. Please try again.");
    } finally {
      setIsAiEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title, description, dueDate || undefined);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Task Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design the landing page..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Description
              </label>
              <button
                type="button"
                disabled={isAiEnhancing || !title}
                onClick={handleAiSuggest}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAiEnhancing ? (
                  <>
                    <Clock size={14} className="animate-spin" />
                    Gemini is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    AI Suggest
                  </>
                )}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setAiError(""); }}
              placeholder="Describe what needs to be done..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-slate-700"
            />
            {aiError && (
              <p className="text-xs text-red-500 font-medium mt-1">{aiError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
