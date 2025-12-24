
import React, { useState } from 'react';

interface StoryInputProps {
  onProcess: (text: string) => void;
  isLoading: boolean;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onProcess, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onProcess(text);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8">
        <h2 className="text-2xl font-serif text-slate-800 mb-2">Write Your Story</h2>
        <p className="text-slate-500 mb-6">Enter a few paragraphs or a whole story. We'll visualize it segment by segment with consistent characters and scenes.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="Once upon a time, in a glowing forest... (Separate sentences with periods for best results)"
            className="w-full h-48 p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none font-medium leading-relaxed"
          />
          
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] ${
              isLoading || !text.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Story...
              </span>
            ) : (
              'Visualize Story'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
