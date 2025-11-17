// AskAI.tsx — captures multiple screenshots evenly spaced around the center time
import React, { useCallback, useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import {
  Box, Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, TextField, Typography
} from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import beepStart from "../assets/beepStart.mp3";
import beepStop from "../assets/beepStop.mp3";

interface AskAIProps {
  videoID: string | number;
  timeStamp: number; 
  videoUrl?: string | null; //  S3 presigned URL
  videoAD?: string | null; // optional audio description
  screenshotCount?: number; // default 5
  screenshotIntervalSec?: number; // spacing in seconds between screenshots (default 1)
}

const AUTO_STOP_MS = 3000;
const SCREENSHOT_WIDTH = 640;
const LAMBDA_API_URL = "https://rhoeszjsouxvlq5bdbd6rhvbpm0vdzwx.lambda-url.us-east-2.on.aws/"; // <- update

export default function AskAI({
  videoID,
  timeStamp,
  videoUrl,
  videoAD = null,
  screenshotCount = 5,
  screenshotIntervalSec = 1,
}: AskAIProps) {
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [alertText, setAlertText] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // preview state
  const [capturedPreviewImages, setCapturedPreviewImages] = useState<string[]>([]); // data:image/png;base64,...
  const [capturedBase64Payload, setCapturedBase64Payload] = useState<string[]>([]); // plain base64 (no prefix)
  const [capturedTimestamps, setCapturedTimestamps] = useState<number[]>([]);

  const synthRef = useRef(window.speechSynthesis);
  const inactivityTimerRef = useRef<number | null>(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  useEffect(() => setEditableTranscript(transcript), [transcript]);

  const speakText = useCallback((text: string) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const selected = voices.find((v) => v.name === "Google US English");
    if (selected) utter.voice = selected;
    synthRef.current.cancel();
    synthRef.current.speak(utter);
  }, []);

  const playBeep = (type: "start" | "stop") => {
    const audio = new Audio(type === "start" ? beepStart : beepStop);
    audio.play().catch(() => {});
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };
  useEffect(() => {
    if (!isListening) return;
    clearInactivityTimer();
    inactivityTimerRef.current = window.setTimeout(() => {
      stopListening();
    }, AUTO_STOP_MS);
  }, [transcript, isListening]);

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setShowAlert(true);
      setAlertText("Your browser doesn't support speech recognition.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
    playBeep("start");
    clearInactivityTimer();
    inactivityTimerRef.current = window.setTimeout(() => stopListening(), AUTO_STOP_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserSupportsSpeechRecognition]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    playBeep("stop");
    clearInactivityTimer();
  }, []);

  useEffect(() => {
  const handler = (ev: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? ev.metaKey : ev.ctrlKey;

    // Open AskAI dialog
    if (cmdKey && ev.key.toLowerCase() === 'q') {
      setOpen(true);
      startListening();
    }

    // Capture screenshots / trigger question submission
    if (cmdKey && ev.key.toLowerCase() === 's' && open) {
      handleQuestion();
    }
  };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, isListening, startListening, stopListening]);

  // builds an array of timestamps centered at centerSec
  const buildTimestamps = (centerSec: number, count: number, intervalSec: number): number[] => {
    const half = Math.floor(count / 2);
    const stamps: number[] = [];
    for (let i = 0; i < count; i++) {
      const offset = (i - half) * intervalSec;
      stamps.push(Number((centerSec + offset).toFixed(3))); // keep millisecond precision if needed
    }
    return stamps;
  };

  // capture frames client-side and return both data URLs and base64 strings
  async function captureFramesFromUrl(src: string, times: number[]): Promise<{ dataUrls: string[]; base64s: string[]; actualTimes: number[] }> {
    const video = document.createElement("video");
    // MUST set crossorigin before src
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.src = src;
    video.preload = "auto";

    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error("video load failed (CORS or network)")); };
      const cleanup = () => { video.removeEventListener("loadedmetadata", onLoaded); video.removeEventListener("error", onError); };
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);
      setTimeout(() => { if (video.readyState >= 1) { cleanup(); resolve(); } }, 1500);
    });

    const aspect = video.videoWidth && video.videoHeight ? (video.videoWidth / video.videoHeight) : (16/9);
    const canvas = document.createElement("canvas");
    canvas.width = SCREENSHOT_WIDTH;
    canvas.height = Math.round(SCREENSHOT_WIDTH / aspect);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas context");

    const dataUrls: string[] = [];
    const base64s: string[] = [];
    const actualTimes: number[] = [];

    for (const requested of times) {
      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => {
          try {
            // clamp draw using actual video.currentTime (some browsers adjust slightly)
            const actual = video.currentTime;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            dataUrls.push(dataUrl);
            base64s.push(dataUrl.split(",")[1]); // plain base64
            actualTimes.push(Number(actual.toFixed(3)));
            cleanup();
            resolve();
          } catch (err) { cleanup(); reject(err); }
        };
        const onError = () => { cleanup(); reject(new Error("video error during seek")); };
        const cleanup = () => {
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
        };
        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        // clamp requested time to duration bounds (if available)
        const clamped = Math.max(0, Math.min(requested, (video.duration || requested)));
        try {
          video.currentTime = clamped;
        } catch (err) {
          // some browsers throw when setting currentTime immediately — try after small delay
          setTimeout(() => {
            try { video.currentTime = clamped; } catch (e) { cleanup(); reject(e); }
          }, 200);
        }
      });
    }
    video.src = "";
    return { dataUrls, base64s, actualTimes };
  }

  // If client-side capture possible, do it; else send request without screenshots and let backend extract
  async function prepareScreenshots(): Promise<{ base64s: string[]; timestamps: number[] }> {
    setCapturedPreviewImages([]);
    setCapturedBase64Payload([]);
    setCapturedTimestamps([]);

    if (!videoUrl) return { base64s: [], timestamps: [] };
    // if it's a YouTube URL, avoid client capture (CORS) — let backend download and extract
    const isYouTube = /youtu(be)?\.?/.test(videoUrl);
    if (isYouTube) {
      // still send timestamps for server extraction
      const stamps = buildTimestamps(timeStamp, screenshotCount, screenshotIntervalSec);
      return { base64s: [], timestamps: stamps };
    }

    try {
      const stamps = buildTimestamps(timeStamp, screenshotCount, screenshotIntervalSec);
      const { dataUrls, base64s, actualTimes } = await captureFramesFromUrl(videoUrl, stamps);
      setCapturedPreviewImages(dataUrls);
      setCapturedBase64Payload(base64s);
      setCapturedTimestamps(actualTimes);
      return { base64s, timestamps: actualTimes.length === stamps.length ? actualTimes : stamps };
    } catch (err) {
      console.warn("client capture failed, will let backend extract", err);
      // fallback: request server to extract same timestamps
      const stamps = buildTimestamps(timeStamp, screenshotCount, screenshotIntervalSec);
      return { base64s: [], timestamps: stamps };
    }
  }

  // send to Lambda: JSON with either videoS3Key OR youtube_url, timestamps, screenshots (base64), question, video_ad
  const handleQuestion = async () => {
  setLoading(true);
  try {
    // 1) Prepare screenshots from video (client-side)
    const { base64s, timestamps } = await prepareScreenshots();

    // 2) Build payload for Lambda
    const payload: any = {
      video_id: String(videoID),
      question: editableTranscript,
      timestamps,            // optional, used by backend for reference
      screenshots_base64: base64s, // plain base64 array
    };

    // optional extra context
    if (videoAD) payload.video_ad = videoAD;
    if (videoUrl) payload.youtube_url = videoUrl;

    // 3) Send to Lambda
    const resp = await axios.post(LAMBDA_API_URL, payload, { timeout: 120000 });
    const data = resp.data;

    // 4) Set Gemini response
    if (data?.gemini_response) {
      setResponse(
        typeof data.gemini_response === "string"
          ? data.gemini_response
          : JSON.stringify(data.gemini_response, null, 2)
      );
    }

    // 5) Preview screenshots returned (optional)
    if (Array.isArray(data?.screenshots) && data.screenshots.length > 0) {
      setCapturedPreviewImages(
        data.screenshots.map((s: any, idx: number) =>
          s.url || `data:image/png;base64,${base64s[idx] || ""}`
        )
      );
    }
  } catch (err) {
    console.error(err);
    setShowAlert(true);
    setAlertText("Failed to send question. See console.");
  } finally {
    setLoading(false);
    stopListening();
  }
};

  return (
    <>
      {showAlert && (
        <Box sx={{ mb: 1 }}>
          <Typography color="error">{alertText}</Typography>
        </Box>
      )}

      <Button
        variant="contained"
        sx={{ borderRadius: 3, px: 3, py: 1.25, width: "100%", textTransform: "none" }}
        onClick={() => { setOpen(true); startListening(); }}
        startIcon={<PlayArrowIcon />}
      >
        Ask question at {timeStamp}
      </Button>

      <Dialog open={open} onClose={() => { setOpen(false); stopListening(); }} fullWidth maxWidth="sm">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 3 }}>
          <IconButton
            aria-label={isListening ? "Stop listening" : "Start listening"}
            onClick={() => { if (isListening) stopListening(); else startListening(); }}
            sx={{
              bgcolor: isListening ? "primary.main" : "grey.200",
              color: isListening ? "common.white" : "text.primary",
              width: 84,
              height: 84,
              "&:hover": { bgcolor: isListening ? "primary.dark" : "grey.300" },
            }}
          >
            <KeyboardVoiceIcon sx={{ fontSize: 36 }} />
          </IconButton>

          <Typography variant="h6" sx={{ mt: 2 }}>
            {isListening ? "Listening…" : "Ask your question"}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Press <strong>q</strong> to open • Press <strong>s</strong> to start/stop listening
          </Typography>
        </Box>

        <DialogTitle sx={{ pt: 2 }}>{response ? "Response" : "Your Question"}</DialogTitle>

        <DialogContent>
          {!response ? (
            <>
              <TextField
                label="Your Question"
                placeholder="Speak or type your question"
                multiline
                minRows={3}
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
              />

              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <ButtonGroup variant="contained" aria-label="speech controls">
                  <Button onClick={() => (isListening ? stopListening() : startListening())}>
                    {isListening ? "Stop" : "Start"}
                  </Button>
                  <Button onClick={() => speakText(editableTranscript || "No text to speak.")}>
                    Text to Speech
                  </Button>
                  <Button onClick={() => { resetTranscript(); setEditableTranscript(""); if (!isListening) startListening(); }}>
                    Reset
                  </Button>
                </ButtonGroup>
              </Box>
            </>
          ) : (
            <DialogContentText sx={{ mt: 1 }}>{response}</DialogContentText>
          )}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Live transcript preview */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Live transcript preview:
            </Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>
              {transcript || "..."}
            </Typography>
          </Box>

          {/* Show captured screenshots preview if present */}
          {capturedPreviewImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Captured screenshots:
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {capturedPreviewImages.map((dataUrl, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={dataUrl}
                    alt={`screenshot ${idx}`}
                    sx={{ width: 140, height: "auto", borderRadius: 1, boxShadow: 1 }}
                  />
                ))}
              </Box>
              {/* show timestamps for each preview (if available) */}
              {capturedTimestamps.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Times: {capturedTimestamps.map(t => t.toFixed(2)).join(", ")}s
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {!response ? (
            <>
              <Button onClick={() => { setOpen(false); stopListening(); resetTranscript(); setEditableTranscript(""); setCapturedPreviewImages([]); setCapturedBase64Payload([]); }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleQuestion}
                disabled={!editableTranscript || loading}
              >
                Submit Question
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => { setResponse(""); resetTranscript(); setEditableTranscript(""); setCapturedPreviewImages([]); setCapturedBase64Payload([]); setCapturedTimestamps([]); }}>
                Ask another question
              </Button>
              <Button onClick={() => { setOpen(false); stopListening(); }}>
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
