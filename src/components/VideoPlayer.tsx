import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Typography, Grid } from "@mui/material";
import DisplayDescriptions from "./DisplayDescriptions";
import YouTube from "react-youtube";

interface Description {
  text_history: string[];
  timestamp_start: string;
  timestamp_end: string;
  [key: string]: any;
}

interface VideoPlayerProps {
  videoID?: number; // (optional, not needed if URL includes the id)
  yesDesc: boolean;
  presignedUrl: string;
  youtubeUrl?: string;
  title: string;
  descriptionList?: Description[];
  parentCallback: (currentTime: number, audioDescription?: any, playVid?: boolean) => void;
}

function getYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;

  // If someone passes just the ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;

  try {
    const u = new URL(urlOrId);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    // youtube.com/watch?v=<id>
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // youtube.com/embed/<id>
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) {
        const id = parts[embedIndex + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  yesDesc,
  presignedUrl,
  youtubeUrl,
  title,
  descriptionList,
  parentCallback
}) => {
  const defaultDescription: Description = {
    text_history: ["No description playing"],
    timestamp_start: "-",
    timestamp_end: "-"
  };

  const [videoDescriptions, setVideoDescriptions] = useState<Description[]>([defaultDescription]);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState<number>(0);
  const [prevDescriptionIndex, setPrevDescriptionIndex] = useState<number>(0);

  const activeRangeIndexRef = useRef<number | null>(null);
  const playedInActiveRangeRef = useRef<boolean>(false);
  const isSpeechActiveRef = useRef<boolean>(false);

  // Priority: Use YouTube URL if available, otherwise use S3 presigned URL
  const youtubeId = useMemo(() => {
    if (youtubeUrl && youtubeUrl.trim()) {
      const id = getYouTubeId(youtubeUrl);
      console.log('YouTube URL:', youtubeUrl, 'Extracted ID:', id);
      return id;
    }
    return null;
  }, [youtubeUrl]);
  
  const isYouTube = Boolean(youtubeId);

  const ytPlayerRef = useRef<any>(null);
  const ytTickRef = useRef<number | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('VideoPlayer Props:', {
      youtubeUrl,
      presignedUrl,
      youtubeId,
      isYouTube
    });
  }, [youtubeUrl, presignedUrl, youtubeId, isYouTube]);

  useEffect(() => {
    const updatedDescriptions = [defaultDescription, ...(descriptionList || [])];
    setCurrentDescriptionIndex(0);
    setPrevDescriptionIndex(0);
    activeRangeIndexRef.current = null;
    playedInActiveRangeRef.current = false;
    isSpeechActiveRef.current = false;
    setVideoDescriptions(updatedDescriptions);
  }, [descriptionList]);

  const runDescriptionLogic = useCallback(
    (currentTime: number, controls: { pause: () => void; isPaused: () => boolean }) => {
      parentCallback(currentTime);

      // If descriptions are disabled, reset
      if (!yesDesc || videoDescriptions.length <= 1) {
        if (currentDescriptionIndex !== 0) {
          setCurrentDescriptionIndex(0);
          setPrevDescriptionIndex(0);
        }
        activeRangeIndexRef.current = null;
        playedInActiveRangeRef.current = false;
        isSpeechActiveRef.current = false;
        return;
      }

      // If speech active, keep paused
      if (isSpeechActiveRef.current && !controls.isPaused()) {
        controls.pause();
      }

      // Find range containing current time
      const index = videoDescriptions.findIndex((description, idx) => {
        if (idx === 0) return false;
        const start = Number(description.timestamp_start);
        const end = Number(description.timestamp_end);
        if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
        return currentTime >= start && currentTime < end;
      });

      // Not inside any range -> reset if we just left one
      if (index === -1) {
        if (activeRangeIndexRef.current !== null) {
          activeRangeIndexRef.current = null;
          playedInActiveRangeRef.current = false;
          isSpeechActiveRef.current = false;
          setCurrentDescriptionIndex(0);
          setPrevDescriptionIndex(0);
        }
        return;
      }

      // Entered a new range
      if (index !== activeRangeIndexRef.current) {
        activeRangeIndexRef.current = index;
        playedInActiveRangeRef.current = false;
        isSpeechActiveRef.current = false;
      }

      // Trigger once per continuous stay
      if (!playedInActiveRangeRef.current && !isSpeechActiveRef.current) {
        playedInActiveRangeRef.current = true;
        isSpeechActiveRef.current = true;

        setPrevDescriptionIndex(currentDescriptionIndex);
        setCurrentDescriptionIndex(index);

        if (!controls.isPaused()) {
          controls.pause();
        }
      }
    },
    [currentDescriptionIndex, parentCallback, yesDesc, videoDescriptions]
  );

  const debouncedHandleTimeUpdate = useCallback(() => {
    const videoElement = document.getElementById("video") as HTMLVideoElement | null;
    if (!videoElement) return;

    const currentTime = Math.floor(videoElement.currentTime);

    runDescriptionLogic(currentTime, {
      pause: () => videoElement.pause(),
      isPaused: () => videoElement.paused
    });
  }, [runDescriptionLogic]);

  useEffect(() => {
    if (isYouTube) return;
    const videoElement = document.getElementById("video") as HTMLVideoElement | null;
    if (!videoElement) return;

    const handleTimeUpdate = (): void => {
      debouncedHandleTimeUpdate();
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [debouncedHandleTimeUpdate, isYouTube]);

  useEffect(() => {
    if (isYouTube) return;
    const videoElement = document.getElementById("video") as HTMLVideoElement | null;
    if (!videoElement) return;

    const handlePlay = (): void => {
      if (isSpeechActiveRef.current) {
        videoElement.pause();
      }
    };

    videoElement.addEventListener("play", handlePlay);
    return () => {
      videoElement.removeEventListener("play", handlePlay);
    };
  }, [isYouTube]);

  useEffect(() => {
    if (isYouTube) return;
    const videoElement = document.getElementById("video") as HTMLVideoElement | null;
    if (!videoElement) return;

    const handleSeeking = (): void => {
      // Seeking resets range tracking unless still inside same range (your old logic was more complex)
      activeRangeIndexRef.current = null;
      playedInActiveRangeRef.current = false;
      isSpeechActiveRef.current = false;
      setCurrentDescriptionIndex(0);
      setPrevDescriptionIndex(0);
    };

    videoElement.addEventListener("seeking", handleSeeking);
    return () => {
      videoElement.removeEventListener("seeking", handleSeeking);
    };
  }, [isYouTube]);

  // =========================
  // ✅ YouTube path
  // =========================
  useEffect(() => {
    if (!isYouTube) return;

    // clear any previous timer
    if (ytTickRef.current) {
      window.clearInterval(ytTickRef.current);
      ytTickRef.current = null;
    }

    const tick = () => {
      const player = ytPlayerRef.current;
      if (!player) return;

      const currentTime = Math.floor(player.getCurrentTime());

      runDescriptionLogic(currentTime, {
        pause: () => player.pauseVideo(),
        isPaused: () => player.getPlayerState && player.getPlayerState() !== 1 // 1 = PLAYING
      });

      // If speech is active and user tries to play, force pause
      if (isSpeechActiveRef.current) {
        try {
          const state = player.getPlayerState?.();
          if (state === 1) player.pauseVideo();
        } catch {
          // ignore
        }
      }
    };

    // Poll currentTime (YouTube doesn't give a clean per-second event)
    ytTickRef.current = window.setInterval(tick, 250);

    return () => {
      if (ytTickRef.current) {
        window.clearInterval(ytTickRef.current);
        ytTickRef.current = null;
      }
    };
  }, [isYouTube, runDescriptionLogic]);

  const handleCallback = (playedIndex: number): void => {
    isSpeechActiveRef.current = false;
    setPrevDescriptionIndex(playedIndex);

    if (isYouTube) {
      const player = ytPlayerRef.current;
      if (player) player.playVideo();
    } else {
      const videoElement = document.getElementById("video") as HTMLVideoElement | null;
      if (videoElement) videoElement.play();
    }
  };

  const currentDescription = videoDescriptions[currentDescriptionIndex] || defaultDescription;

  return (
    <div>
      {/* If YouTube URL exists and is valid, render YouTube player. Otherwise render HTML5 <video> with S3 URL */}
      {isYouTube && youtubeId ? (
        <YouTube
          videoId={youtubeId}
          opts={{
            width: "100%",
            height: "500",
            playerVars: { autoplay: 0 }
          }}
          onReady={(e) => {
            ytPlayerRef.current = e.target;
            console.log('YouTube player ready');
          }}
          onError={(e) => {
            console.error('YouTube player error:', e);
          }}
        />
      ) : presignedUrl && presignedUrl.trim() ? (
        <video id="video" controls width="100%" height="500px" aria-label="Play the video">
          <source src={presignedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={{ 
          width: "100%", 
          height: "500px", 
          backgroundColor: "#f0f0f0", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: "1px solid #ccc"
        }}>
          <Typography>No video source available</Typography>
        </div>
      )}

      <Grid mt={2}>
        <Typography className="heading-highlighted" mb={2}>
          {title}
        </Typography>

        {yesDesc && (
          <DisplayDescriptions
            description={currentDescription}
            parentCallback={handleCallback}
            cIndex={currentDescriptionIndex}
            pIndex={prevDescriptionIndex}
          />
        )}
      </Grid>
    </div>
  );
};

export default VideoPlayer;