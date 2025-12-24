
import React, { useState, useCallback } from 'react';
import { StoryInput } from './components/StoryInput';
import { StoryView } from './components/StoryView';
import { StorySegment } from './types';
import { generateImageWithContext } from './services/geminiService';

const App: React.FC = () => {
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const processStory = useCallback(async (fullText: string) => {
    setIsProcessing(true);
    setSegments([]);

    // Logic for splitting the story:
    // Split by sentences (periods, question marks, exclamation points) 
    // and potentially by newlines to respect paragraph breaks.
    const rawSegments = fullText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const initialSegments: StorySegment[] = rawSegments.map((text, idx) => ({
      id: `seg-${idx}-${Date.now()}`,
      text,
      status: 'pending'
    }));

    setSegments(initialSegments);
    setProgress({ current: 0, total: initialSegments.length });

    const updatedSegments = [...initialSegments];
    const generatedImages: string[] = [];

    // Process each segment one by one to pass reference images
    for (let i = 0; i < updatedSegments.length; i++) {
      updatedSegments[i].status = 'processing';
      setSegments([...updatedSegments]);
      setProgress({ current: i + 1, total: updatedSegments.length });

      try {
        const imageUrl = await generateImageWithContext(
          updatedSegments[i].text,
          generatedImages
        );
        
        updatedSegments[i].imageUrl = imageUrl;
        updatedSegments[i].status = 'completed';
        generatedImages.push(imageUrl);
      } catch (error) {
        console.error(`Error at segment ${i}:`, error);
        updatedSegments[i].status = 'error';
        updatedSegments[i].error = "Failed to visualize this scene.";
      }

      setSegments([...updatedSegments]);
    }

    setIsProcessing(false);
  }, []);

  const reset = () => {
    setSegments([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900">
          Story Visionary
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Turn your imagination into a visual journey. Write a story, and watch it come to life one frame at a time.
        </p>
      </header>

      <main className="container mx-auto pb-20 px-4">
        {segments.length === 0 ? (
          <div className="max-w-4xl mx-auto pt-8">
            <StoryInput onProcess={processStory} isLoading={isProcessing} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress Header */}
            <div className="sticky top-4 z-40 max-w-lg mx-auto bg-white/80 backdrop-blur shadow-xl rounded-full p-2 border border-slate-100 mb-12">
              <div className="flex items-center justify-between px-6 py-2">
                <button 
                  onClick={reset}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  disabled={isProcessing}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="flex flex-col items-center">
                   <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Progress</span>
                   <span className="text-sm font-bold text-indigo-600">{progress.current} / {progress.total} Frames</span>
                </div>
                <div className="w-6"></div> {/* Spacer */}
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <StoryView segments={segments} isGenerating={isProcessing} />
            
            {!isProcessing && (
              <div className="flex flex-col items-center gap-6 mt-16 pt-16 border-t border-slate-100">
                <p className="text-slate-400 font-medium">Ready for a new adventure?</p>
                <button
                  onClick={reset}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Create Another Story
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-12 text-slate-400 text-sm">
        Powered by Gemini • Visualize your dreams
      </footer>
    </div>
  );
};

export default App;
