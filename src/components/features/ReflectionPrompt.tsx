
import React, { useState } from 'react';
import { Save, X, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ReflectionPrompt: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const handleSave = async () => {
    if (!text.trim()) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this note into a crisp, actionable one-liner title or summary. Note: "${text}"`,
        config: {
          systemInstruction: "You are a concise executive assistant. Provide a summary under 10 words.",
          temperature: 0.3,
        }
      });
      
      setSavedNote(response.text || "Note saved.");
      setText('');
    } catch (error) {
      setSavedNote("Note saved successfully.");
      setText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-card p-6 h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Capture</h3>
      {savedNote ? (
        <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 animate-enter">
          <div className="flex items-center gap-3">
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
             <p className="text-sm font-medium text-emerald-200">{savedNote}</p>
          </div>
          <button onClick={() => setSavedNote(null)} className="text-emerald-500 hover:text-emerald-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-full min-h-[100px] p-3 bg-[#0B0F17] border border-gray-800 rounded-xl text-sm text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600 resize-none"
          />
          <div className="flex justify-between items-center mt-auto">
             <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">AI Summarized</span>
             <button 
               onClick={handleSave}
               disabled={loading || !text}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${loading || !text ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
             >
               {loading ? 'Saving...' : 'Save Note'} 
               {!loading && <Save className="w-3.5 h-3.5" />}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionPrompt;
