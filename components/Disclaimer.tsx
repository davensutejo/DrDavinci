
import React, { useState } from 'react';
import { DISCLAIMER } from '../constants';

interface DisclaimerProps {
  onClose?: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onClose }) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    // Check if user has dismissed this in current session
    try {
      return sessionStorage.getItem('disclaimer_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('disclaimer_dismissed', 'true');
    } catch {
      // Fallback if sessionStorage is unavailable
    }
    onClose?.();
  };

  if (isDismissed) return null;

  return (
    <div className="bg-amber-50 border-t border-amber-200 px-4 py-3 sm:py-4 animate-in slide-in-from-top duration-300">
      <div className="max-w-4xl mx-auto flex gap-3 items-start">
        <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-[10px] sm:text-xs text-amber-800 leading-relaxed font-medium flex-1">
          {DISCLAIMER}
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 ml-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded transition-all duration-200 hover:scale-110 active:scale-90"
          title="Close disclaimer"
          aria-label="Close disclaimer"
        >
          <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
