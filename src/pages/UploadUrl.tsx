import React, { useState } from "react";
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
  Container,
  Fade,
  Stack,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  VideoLibrary as VideoLibraryIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import UploadDialog from "../components/UploadDialog";

const drawerWidth = 200;

interface CustomizationSettings {
  mode: 'none' | 'default' | 'personal';
  length?: number;
  emphasis?: 'character' | 'environment' | 'general' | 'instructional';
  personalGuidelines?: string;
}

const UploadURL: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("Add a YouTube Video");
  const [smallHeading, setSmallHeading] = useState<string>(
    "Generate audio descriptions for a youtube video by pasting the URL below."
  );
  const [url, setUrl] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("public");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleCloseAlertCallback = (): void => {
    setAlertOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setUrl(value);
  };

  const handleSubmitClick = (): void => {
    const token = Cookies.get("jwtToken");

    if (!token) {
      setAlertOpen(true);
      return;
    }

    setDialogOpen(true);
  };

  const handleURLUpload = (customizations?: CustomizationSettings): void => {
    const apiUrl = "https://vidscribe.org/b/api/youtube_video/";

    const postData = {
      youtube_url: url,
      public_or_private: visibility,
      customizations: customizations,
    };

    setHeading("Processing Your Video");
    setSmallHeading(
      "Generating audio descriptions... This may take a few moments. Please don't refresh the page."
    );
    setLoading(true);

    axios
      .post(apiUrl, postData)
      .then((response) => {
        console.log("Response:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setHeading("Something Went Wrong");
        setSmallHeading("Please check your URL and try again. Make sure it's a valid YouTube link.");
      });
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <SideNav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {alertOpen && (
          <AlertBar
            alertText={"You need to be signed in to upload a video on Vidscribe"}
            parentCallback={handleCloseAlertCallback}
          />
        )}

        <Container maxWidth="md">
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid #e0e0e0",
              }}
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
                >
                  {loading ? (
                    <CircularProgress size={40} />
                  ) : (
                    <VideoLibraryIcon sx={{ fontSize: 40, color: "primary.main" }} />
                  )}
                </Box>

                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "primary.dark",
                      mb: 1,
                    }}
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
                  >
                    {smallHeading}
                  </Typography>
                </Box>
              </Stack>

              {/* Input Section */}
              {!loading && (
                <Fade in timeout={600}>
                  <Stack spacing={3}>
                    <TextField
                      label="YouTube URL"
                      placeholder="https://www.youtube.com/watch?v=..."
                      onChange={handleChange}
                      value={url}
                      fullWidth
                      variant="outlined"
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading || url.trim() === ""}
                      onClick={handleSubmitClick}
                      startIcon={<CloudUploadIcon />}
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
                    >
                      Generate Descriptions
                    </Button>
                  </Stack>
                </Fade>
              )}

              {/* Loading State */}
              {loading && (
                <Fade in timeout={600}>
                  <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="body2" color="text.secondary">
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
                >
                  {[
                    { icon: "🎬", text: "Paste any YouTube URL" },
                    { icon: "🤖", text: "AI generates descriptions" },
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
                    >
                      <Typography variant="h5" sx={{ mb: 0.5 }}>
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
        </Container>
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