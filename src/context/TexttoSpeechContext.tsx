import React, { createContext, useContext, useCallback, useEffect, useRef } from 'react';

interface TextToSpeechContextType {
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

const TextToSpeechContext = createContext<TextToSpeechContextType | undefined>(undefined);

export const TextToSpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSpeakingRef = useRef<boolean>(false);
  const [isSupported] = React.useState<boolean>(() => 'speechSynthesis' in window);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSupported || !text.trim()) {
      console.warn('Speech synthesis not supported or empty text provided');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options with defaults
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;
    
    // Track speaking state
    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (options.onEnd) {
        options.onEnd();
      }
    };
    
    utterance.onerror = (event) => {
      isSpeakingRef.current = false;
      console.error('Speech synthesis error:', event);
      if (options.onError) {
        options.onError(event);
      }
    };
    
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
  }, []);

  const value: TextToSpeechContextType = {
    speak,
    stop,
    isSpeaking: isSpeakingRef.current,
    isSupported,
  };

  return (
    <TextToSpeechContext.Provider value={value}>
      {children}
    </TextToSpeechContext.Provider>
  );
};

// Custom hook to use the TextToSpeech context
export const useTextToSpeech = (): TextToSpeechContextType => {
  const context = useContext(TextToSpeechContext);
  if (context === undefined) {
    throw new Error('useTextToSpeech must be used within a TextToSpeechProvider');
  }
  return context;
};