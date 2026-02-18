import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Grid, Button, Fade, Collapse } from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import AskAI from "./AskAI";
import AlertBar from "./AlertBar";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuthenticator } from '@aws-amplify/ui-react';

interface MenuOptionsProps {
  video_id: number | undefined;
  video_path: string | undefined;
  videoUrl?: string | null;
  title?: string;
  parentCallback: (descOn: boolean) => void;
  time: number;
  youtubeID: string | undefined;
  videoDescriptions?: any;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({
  video_id,
  video_path,
  videoUrl,
  title,
  parentCallback,
  time,
  youtubeID,
  videoDescriptions,
}) => {
  const [alerttext, setAlerttext] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [turnOnOff, setturnOnOff] = useState<"off" | "on">("off");
  const [descOn, setDescOn] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuthenticator();
  const token = Cookies.get("jwtToken");

  // console.log("MenuOptions video ids and paths", video_id, videoUrl, youtubeID, title);

  const handleShareButtonClick = (): void => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAddDescriptions = (): void => {
    if (!isLoggedIn) {
      setShowAlert(true);
      setAlerttext("You need to have an account to add descriptions");
    } else {
      navigate("/AddDescriptions", {
        state: { video_id: video_id, video_path: video_path, youtubeID: youtubeID },
      });
    }
  };

  const handleEditDescriptions = (): void => {
    // if (!isLoggedIn) {
    //   setShowAlert(true);
    //   setAlerttext("You need to have an account to edit descriptions");
    // } else {
    navigate("/EditDescriptions", {
      state: { video_id: video_id, videoUrl: videoUrl, youtubeID: youtubeID, title: title },
    });
    // }
  };

  const handleViewDescriptions = (): void => {
    setturnOnOff((prev) => (prev === "off" ? "on" : "off"));
    setDescOn((prev) => !prev);
    parentCallback(descOn);
  };

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
    }
  }, [token]);

  const handleCloseAlertCallback = (): void => {
    setShowAlert(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden"
      }}
    >
      {showAlert && (
        <AlertBar
          alertText={alerttext}
          parentCallback={handleCloseAlertCallback}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          p: 2.5,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          Video Options
        </Typography>
      </Box>

      {/* Content */}
      <Stack spacing={1.5} sx={{ p: 2.5 }}>
        {/* Toggle Descriptions */}
        <Button
          variant="contained"
          fullWidth
          startIcon={descOn ? <VisibilityIcon /> : <VisibilityOffIcon />}
          onClick={handleViewDescriptions}
          sx={{
            py: 1.5,
            px: 2.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            background: descOn
              ? "linear-gradient(135deg, primary.main 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            },
          }}
          aria-label="Turn on/off descriptions for the video"
        >
          Turn {turnOnOff} descriptions
        </Button>


        {/* Ask AI */}
        <AskAI videoID={video_id} timeStamp={time} videoUrl={videoUrl} videoAD={videoDescriptions} username={user.signInDetails?.loginId} />

        {/* Edit Descriptions */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<EditIcon />}
          onClick={handleEditDescriptions}
          sx={{
            py: 1.5,
            px: 2.5,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
          aria-label="If you want to edit the descriptions, you can do so by clicking on this button"
        >
          Edit descriptions
        </Button>

        {/* Share Video */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={copied ? <CheckCircleIcon /> : <ShareIcon />}
          onClick={handleShareButtonClick}
          sx={{
            py: 1.5,
            px: 2.5,
            textTransform: "none",
            borderColor: copied ? "#10B981" : "default",
            color: copied ? "#10B981" : "default",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: copied ? "#10B981" : "default",
              backgroundColor: copied ? "rgba(16, 185, 129, 0.08)" : "rgba(107, 114, 128, 0.08)",
              transform: "translateY(-2px)",
            },
          }}
          aria-label="If you want share the video with other users, the url will be copied to your clipboard"
        >
          {copied ? "Link copied!" : "Share video link"}
        </Button>
      </Stack>
    </Box>
  );
};

export default MenuOptions;