
import React from 'react';
import { StorySegment } from '../types';

interface StoryViewProps {
  segments: StorySegment[];
  isGenerating: boolean;
}

export const StoryView: React.FC<StoryViewProps> = ({ segments, isGenerating }) => {
  if (segments.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-16 pb-24 px-4">
      {segments.map((segment, index) => (
        <div key={segment.id} className="relative group">
          <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                {segment.status === 'processing' && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-indigo-700 font-semibold animate-pulse">Painting frame {index + 1}...</p>
                  </div>
                )}
                
                {segment.imageUrl ? (
                  <img 
                    src={segment.imageUrl} 
                    alt={`Scene for segment ${index + 1}`} 
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                  />
                ) : segment.status === 'pending' ? (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <span className="text-4xl">🎨</span>
                  </div>
                ) : segment.status === 'error' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-500 p-4 text-center">
                    <span className="text-3xl mb-2">⚠️</span>
                    <p className="text-sm font-medium">{segment.error || "Failed to generate"}</p>
                  </div>
                ) : null}
                
                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center font-bold text-indigo-600 z-20">
                  {index + 1}
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2">
              <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-slate-800 italic">
                "{segment.text}"
              </blockquote>
              <div className="h-1 w-20 bg-indigo-100 mt-6 rounded-full group-hover:w-32 transition-all duration-500"></div>
            </div>
          </div>
          
          {/* Connector Line */}
          {index < segments.length - 1 && (
            <div className="absolute left-1/2 -bottom-16 w-0.5 h-12 bg-indigo-50 hidden md:block"></div>
          )}
        </div>
      ))}

      {isGenerating && (
        <div className="flex justify-center pt-8">
           <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 shadow-md rounded-full">
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             <span className="text-indigo-600 font-medium">The story continues...</span>
           </div>
        </div>
      )}
    </div>
  );
};
