import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from '../components/SideNav'
import AlertBar from "../components/AlertBar";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Fade,
  Stack,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  VideoLibrary as VideoLibraryIcon,
} from "@mui/icons-material";
import axios from "axios";
import { DRAWERWIDTH, PROCESS_YOUTUBE_FILE_URL } from "../utils/constants";
import UploadDialog from "../components/UploadDialog";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTextToSpeech } from '../context/TexttoSpeechContext';

interface CustomizationSettings {
  mode: 'none' | 'custom';
  length?: number;
  emphasis?: 'character' | 'environment' | 'general' | 'instructional';
  subjectiveness?: 'objective' | 'subjective';
  colorPreference?: 'include' | 'exclude';
  frequency?: 8 | 15 | 30;
  personalGuidelines?: string;
}

const UploadURL: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("Add a YouTube Video");
  const [smallHeading, setSmallHeading] = useState<string>(
    "Generate audio descriptions for a youtube video by pasting the URL below. Video should be Shorter than 10 minutesxw."
  );
  const [url, setUrl] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("public");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { user } = useAuthenticator();
  const { speak, stop, isSupported } = useTextToSpeech();

  const navigate = useNavigate();


  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleCloseAlertCallback = (): void => {
    setAlertOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setUrl(value);
  };

  const handleSubmitClick = (): void => {
    setDialogOpen(true);
  };

  const handleURLUpload = (customizations?: CustomizationSettings): void => {
    const apiUrl = PROCESS_YOUTUBE_FILE_URL;

    const postData = {
      youtube_url: url,
      is_public: visibility,
      username: user.signInDetails?.loginId,
      customizations: customizations,
    };

    setHeading("Processing Your Video");
    setSmallHeading(
      "Generating audio descriptions... This may take a few moments. Please don't refresh the page."
    );
    setLoading(true);

    // Announce processing started
    speak("Generating audio descriptions. This may take a few minutes. Please don't refresh the page.");

    axios
      .post(apiUrl, postData)
      .then((response) => {
        console.log("Response:", response.data);

        // Extract video_id from response body
        const responseBody = typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

        const videoId = responseBody.video_id;

        if (videoId) {
          // Navigate to video page with the video ID
          navigate(`/VideoPage/${videoId}`);
        } else {
          console.error("No video_id in response");
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response.data.error == "video_too_long") {
          setLoading(false);
          setHeading("Video Too long");
          setSmallHeading("Please upload a shorter video (less than 10 minutes).");

          // Announce error
          speak("You uploaded a video that is too long. Please upload a shorter video, less than 10 minutes.");
          return;
        }
        else {
          console.log(error.response);
          console.error("Error:", error);
          setLoading(false);
          setHeading("Something Went Wrong");
          setSmallHeading("Please check your URL and try again. Make sure it's a valid YouTube link.");

          // Announce error
          speak("An error occurred while processing your video. Please check your URL and try again. Make sure it's a valid YouTube link and the video is shorter than 10 minutes.");
        }

      });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideNav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${DRAWERWIDTH}px)` },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {alertOpen && (
          <AlertBar
            alertText={"You need to be signed in to upload a video on Vidscribe"}
            parentCallback={handleCloseAlertCallback}
          />
        )}

        <Fade in timeout={800}>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: 700,
              p: 4,
              borderRadius: 2,
            }}
            role="region"
            aria-label="YouTube video upload form"
          >
            {/* Icon and Header */}
            <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: loading ? "#e3f2fd" : "#f3e5f5",
                  transition: "all 0.3s ease",
                }}
                role="img"
                aria-label={loading ? "Processing video" : "Video library icon"}
              >
                {loading ? (
                  <CircularProgress
                    size={40}
                    aria-label="Loading, please wait"
                  />
                ) : (
                  <VideoLibraryIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                    aria-hidden="true"
                  />
                )}
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "primary.dark",
                    mb: 1,
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {heading}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    maxWidth: 500,
                    mx: "auto",
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {smallHeading}
                </Typography>
              </Box>
            </Stack>

            {/* Input Section */}
            {!loading && (
              <Fade in timeout={600}>
                <Stack spacing={3} component="form" onSubmit={(e) => { e.preventDefault(); handleSubmitClick(); }}>
                  <TextField
                    label="YouTube URL"
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={handleChange}
                    value={url}
                    fullWidth
                    variant="outlined"
                    inputProps={{
                      'aria-label': 'YouTube URL',
                      'aria-required': 'true',
                      'aria-invalid': url.trim() !== "" && !url.includes('youtube.com') && !url.includes('youtu.be'),
                    }}
                    helperText="Enter the full URL of the YouTube video you want to add audio descriptions to"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || url.trim() === ""}
                    onClick={handleSubmitClick}
                    startIcon={<CloudUploadIcon aria-hidden="true" />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    aria-label={url.trim() === "" ? "Enter a YouTube URL to enable video processing" : "Generate audio descriptions for the YouTube video"}
                  >
                    Generate Descriptions
                  </Button>
                </Stack>
              </Fade>
            )}

            {/* Loading State */}
            {loading && (
              <Fade in timeout={600}>
                <Stack
                  spacing={2}
                  alignItems="center"
                  sx={{ py: 4 }}
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    aria-live="polite"
                  >
                    This usually takes 30-60 seconds...
                  </Typography>
                </Stack>
              </Fade>
            )}

            {/* Info Cards */}
            {!loading && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4, pt: 4, borderTop: "1px solid #e0e0e0" }}
                role="list"
                aria-label="How it works"
              >
                {[
                  { icon: "🎬", text: "Paste any YouTube URL", ariaLabel: "Step 1: Paste any YouTube URL" },
                  { icon: "🤖", text: "AI generates descriptions", ariaLabel: "Step 2: AI generates descriptions" },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(0,0,0,0.02)",
                    }}
                    role="listitem"
                    aria-label={item.ariaLabel}
                  >
                    <Typography
                      variant="h5"
                      sx={{ mb: 0.5 }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Fade>
      </Box>

      <UploadDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onConfirm={handleURLUpload}
      />
    </Box>
  );
};

export default UploadURL;