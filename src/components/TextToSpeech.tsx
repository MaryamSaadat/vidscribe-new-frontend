import React, { useState, useEffect, useRef } from "react";
import { Box, Stack, Slider, Button, ButtonGroup } from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import SpeedIcon from "@mui/icons-material/Speed";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

interface TextToSpeechProps {
  text: string | string[];
  parentCallback: (playedIndex: number) => void;
  cIndex: number;
  pIndex: number;
  autoPlay?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  parentCallback,
  cIndex,
  pIndex,
  autoPlay = true
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [rate, setRate] = useSessionState<number>("tts_rate", 1);
  const [volume, setVolume] = useSessionState<number>("tts_volume", 1);
  
  const synthRef = useRef(window.speechSynthesis);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentIndexRef = useRef<number>(-1);

  useEffect(() => {
    const synth = synthRef.current;

    console.log(`TextToSpeech - cIndex: ${cIndex}, pIndex: ${pIndex}, isSpeaking: ${isSpeaking}, currentIndexRef: ${currentIndexRef.current}`);

    if (!autoPlay) {
      console.log("AutoPlay disabled, canceling speech");
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      currentUtteranceRef.current = null;
      currentIndexRef.current = -1;
      return;
    }

    const shouldStartSpeech = 
      pIndex !== cIndex && 
      currentIndexRef.current !== cIndex && 
      !isSpeaking;

    if (shouldStartSpeech) {
      console.log(`Starting speech for index ${cIndex}`);
      
      const textToSpeak = Array.isArray(text) ? text.join(" ") : text;
      const newUtterance = new SpeechSynthesisUtterance(textToSpeak);

      const voices = synth.getVoices();
      const googleVoice = voices.find((v) => v.name === "Google US English");
      if (googleVoice) {
        newUtterance.voice = googleVoice;
      }

      // Apply current rate and volume settings
      newUtterance.rate = rate;
      newUtterance.volume = volume;
      newUtterance.pitch = 1;

      setIsSpeaking(true);
      setIsPaused(false);
      currentIndexRef.current = cIndex;

      newUtterance.onstart = () => {
        console.log(`Speech STARTED for index ${cIndex}`);
      };

      newUtterance.onend = () => {
        console.log(`Speech COMPLETED for index ${cIndex}`);
        setIsSpeaking(false);
        setIsPaused(false);
        currentIndexRef.current = -1;
        parentCallback(cIndex);
      };

      newUtterance.onerror = (event) => {
        console.error(`Speech ERROR for index ${cIndex}:`, event.error);
        
        if (event.error !== 'interrupted') {
          setIsSpeaking(false);
          setIsPaused(false);
          currentIndexRef.current = -1;
        } else {
          console.log("Interrupted error - keeping speech state");
        }
      };

      synth.speak(newUtterance);
      currentUtteranceRef.current = newUtterance;

      return () => {
        if (!autoPlay) {
          console.log(`Cleanup - canceling speech for index ${cIndex}`);
          synth.cancel();
          setIsSpeaking(false);
          setIsPaused(false);
          currentIndexRef.current = -1;
        }
      };
    } else {
      console.log(`Skipping speech - already handled`);
    }
  }, [text, cIndex, pIndex, autoPlay, parentCallback, rate, volume]);

  function useSessionState<T>(key: string, defaultValue: T) {
    const [value, setValue] = React.useState<T>(() => {
      const saved = sessionStorage.getItem(key);
      return saved != null ? (JSON.parse(saved) as T) : defaultValue;
    });
  
    React.useEffect(() => {
      sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
  
    return [value, setValue] as const;
  }
  

  const handlePlay = (): void => {
    const synth = synthRef.current;

    if (!autoPlay) {
      console.log("AutoPlay disabled, cannot play");
      return;
    }

    // Resume if paused
    if (isPaused) {
      console.log("▶️ Resuming speech");
      synth.resume();
      setIsPaused(false);
    } 
    // Replay current utterance if stopped
    else if (currentUtteranceRef.current && !isSpeaking) {
      console.log("▶️ Replaying current description");
      const utterance = currentUtteranceRef.current;
      utterance.rate = rate;
      utterance.volume = volume;
      
      setIsSpeaking(true);
      synth.speak(utterance);
    }
  };

  const handleStop = (): void => {
    console.log("Stop button clicked");
    const synth = synthRef.current;
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    currentUtteranceRef.current = null;
    currentIndexRef.current = -1;
  };

  const handleRateChange = (_: Event, value: number | number[]): void => {
    const newRate = Array.isArray(value) ? value[0] : value;
    setRate(newRate);
  
    if (currentUtteranceRef.current && isSpeaking) {
      currentUtteranceRef.current.rate = newRate;
    }
  };
  
  const handleVolumeChange = (_: Event, value: number | number[]): void => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
  
    if (currentUtteranceRef.current && isSpeaking) {
      currentUtteranceRef.current.volume = newVolume;
    }
  };
  

  return (
    <Box>
      <Stack
        spacing={4}
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100%", flex: 1 }}
      >
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
            <VolumeDown sx={{ color: "text.secondary" }} />
            <Slider
              min={0}
              max={1}
              step={0.1}
              aria-label="Change Description Volume"
              value={volume}
              onChange={handleVolumeChange}
            />
            <VolumeUp sx={{ color: "text.secondary" }} />
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
            <SlowMotionVideoIcon sx={{ color: "text.secondary" }} />
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              aria-label="Change Description Speed"
              value={rate}
              onChange={handleRateChange}
            />
            <SpeedIcon sx={{ color: "text.secondary" }} />
          </Stack>
        </Box>
      </Stack>

      <ButtonGroup
        variant="outlined"
        fullWidth
        aria-label="button group to pause, play, and stop text to speech"
        sx={{ mt: 2.5 }}
      >
        <Button
          onClick={handlePlay}
          disabled={!autoPlay || (!isPaused && isSpeaking)}
          startIcon={<PlayArrowIcon />}
        >
          {!autoPlay 
            ? "No Description" 
            : isPaused 
            ? "Resume Current Description" 
            : "Play Current Description"}
        </Button>
        
        <Button
          onClick={handleStop}
          disabled={!autoPlay || (!isSpeaking && !isPaused)}
          startIcon={<StopIcon />}
        >
          Stop Current Description
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default TextToSpeech;