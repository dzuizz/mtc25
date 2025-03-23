'use client';

import React, { useState } from 'react';
import { BrainCircuit, X } from 'lucide-react';

const SpontaneousAnalysisButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const toggleAnalysis = () => {
    if (!isOpen) {
      setIsOpen(true);
      generateAnalysis();
    } else {
      setIsOpen(false);
      setAnalysis(null);
    }
  };

  const generateAnalysis = () => {
    setIsLoading(true);

    // Simulate API call for analysis generation
    setTimeout(() => {
      const currentHour = new Date().getHours();
      let contextBasedAnalysis = '';

      // Generate different analysis based on time of day
      if (currentHour >= 7 && currentHour < 12) {
        contextBasedAnalysis = "Emma is currently engaged in morning circle time. She seems excited and energetic today! Her voice patterns show higher pitch and faster tempo than usual, indicating enthusiasm. She's been socializing actively with two other children for the past 30 minutes. Suggestion: This would be a great time to send her an encouraging emoji.";
      } else if (currentHour >= 12 && currentHour < 14) {
        contextBasedAnalysis = "Emma is likely having lunch now. Her voice patterns indicate she's calm but slightly tired. She's been quieter in the past hour, which is normal before naptime. The caregivers noted she ate well today. Suggestion: She might appreciate a calming voice message before her nap.";
      } else if (currentHour >= 14 && currentHour < 16) {
        contextBasedAnalysis = "Emma is currently in quiet reading time after her nap. Her voice analysis shows she's still a bit sleepy but content. She's been looking at picture books and humming softly to herself. Suggestion: This would be a good time to check in with a gentle voice message.";
      } else {
        contextBasedAnalysis = "Emma is currently engaged in afternoon free play. Her emotional state appears balanced and happy based on recent voice samples. She's been laughing frequently in the past 15 minutes, indicating she's enjoying herself. Suggestion: She&apos;d likely appreciate a quick emoji reaction right now.";
      }

      setAnalysis(contextBasedAnalysis);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleAnalysis}
        className={`fixed bottom-20 right-4 z-50 p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-500' : 'bg-indigo-600'} text-white`}
      >
        {isOpen ? <X size={24} /> : <BrainCircuit size={24} />}
      </button>

      {/* Analysis panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-40 bg-white rounded-lg shadow-xl p-4 w-64 md:w-80 max-w-sm transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-semibold mb-2">Real-time Insight</h3>

          {isLoading ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-600">Analyzing Emma&apos;s current state...</p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{analysis}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => generateAnalysis()}
                  className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                >
                  Refresh
                </button>
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                >
                  Send Emoji
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SpontaneousAnalysisButton;
