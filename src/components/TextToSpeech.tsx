import React, { useState, useEffect } from "react";
import { Box, Stack, Slider, Button, ButtonGroup, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import SpeedIcon from "@mui/icons-material/Speed";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

interface TextToSpeechProps {
  text: string | string[];
  parentCallback: (playedIndex: number) => void;
  cIndex: number;
  pIndex: number;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  parentCallback,
  cIndex,
  pIndex
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pitch, setPitch] = useState<number>(1);
  const [rate, setRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);

  const handleVoiceChange = (event: any): void => {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.name === event.target.value);
    setVoice(selectedVoice || null);
  };

  const handlePlay = (): void => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else if (utterance) {
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      synth.speak(utterance);
    }

    setIsPaused(false);
  };

  useEffect(() => {
    if (pIndex !== cIndex) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();

      const textToSpeak = Array.isArray(text) ? text.join(" ") : text;
      const newUtterance = new SpeechSynthesisUtterance(textToSpeak);
      const googleVoice = voices.find((v) => v.name === "Google US English");

      if (googleVoice) {
        newUtterance.voice = googleVoice;
      }
      newUtterance.pitch = pitch;
      newUtterance.rate = rate;
      newUtterance.volume = volume;

      if (isPaused) {
        setIsPaused(false);
      }
      synth.speak(newUtterance);

      newUtterance.onend = () => {
        parentCallback(cIndex);
      };

      setUtterance(newUtterance);

      return () => {
        synth.cancel();
      };
    }
  }, [text, voice, pitch, rate, volume, cIndex, pIndex, isPaused, parentCallback]);

  const handlePause = (): void => {
    const synth = window.speechSynthesis;
    setIsPaused(true);
    synth.pause();
  };

  const handleStop = (): void => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(false);
  };

  const handleRateChange = (event: Event, value: number | number[]): void => {
    setRate(typeof value === 'number' ? value : value[0]);
  };

  const handleVolumeChange = (event: Event, value: number | number[]): void => {
    setVolume(typeof value === 'number' ? value : value[0]);
  };

  return (
    <Box>
      <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
        <InputLabel id="voice-select-label">Voice</InputLabel>
        <Select
          labelId="voice-select-label"
          value={voice?.name || ""}
          label="Voice"
          onChange={handleVoiceChange}
          sx={{ borderRadius: 2 }}
        >
          {window.speechSynthesis.getVoices().map((voice) => (
            <MenuItem key={voice.name} value={voice.name}>
              {voice.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
          startIcon={isPaused ? <PlayArrowIcon /> : <PlayArrowIcon />}
        >
          {isPaused ? "Resume" : "Play"}
        </Button>
        <Button
          onClick={handlePause}
          startIcon={<PauseIcon />}
        >
          Pause
        </Button>
        <Button
          onClick={handleStop}
          startIcon={<StopIcon />}
        >
          Stop
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default TextToSpeech;