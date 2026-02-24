import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AskAI from "./AskAI";
import AlertBar from "./AlertBar";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuthenticator } from "@aws-amplify/ui-react";

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

  // Keep this if you still use cookies elsewhere, but don't rely on it for UI gating
  const token = Cookies.get("jwtToken");

  const [turnOnOff, setturnOnOff] = useState<"off" | "on">("off");
  const [descOn, setDescOn] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Amplify user may be undefined on public pages
  const { user } = useAuthenticator((ctx) => [ctx.user]);
  const isAuthed = !!user;

  // ✅ Safe username (never crashes)
  const username = user?.signInDetails?.loginId ?? null; // or "Guest"

  const showLoginAlertAndRedirect = (msg: string) => {
    setAlerttext(msg);
    setShowAlert(true);
    // Redirect to login and remember where user came from
    navigate("/login", { replace: false, state: { from: location } });
  };

  const handleShareButtonClick = (): void => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAddDescriptions = (): void => {
    if (!isAuthed) {
      showLoginAlertAndRedirect("You need to login to add descriptions.");
      return;
    }
    navigate("/AddDescriptions", {
      state: { video_id: video_id, video_path: video_path, youtubeID: youtubeID },
    });
  };

  const handleEditDescriptions = (): void => {
    if (!isAuthed) {
      showLoginAlertAndRedirect("You need to login to edit descriptions.");
      return;
    }
    navigate("/EditDescriptions", {
      state: { video_id: video_id, videoUrl: videoUrl, youtubeID: youtubeID, title: title },
    });
  };

  const handleViewDescriptions = (): void => {
    setturnOnOff((prev) => (prev === "off" ? "on" : "off"));
    setDescOn((prev) => !prev);
    // NOTE: parentCallback should receive the *next* value, not the old one
    parentCallback(!descOn);
  };

  // If you still want cookie-based state for other things, you can keep it,
  // but it’s not required for this component anymore.
  useEffect(() => {
    // no-op, kept only if you want to debug token presence
    void token;
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
        overflow: "hidden",
      }}
    >
      {showAlert && (
        <AlertBar alertText={alerttext} parentCallback={handleCloseAlertCallback} />
      )}

      {/* Header */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          p: 2.5,
          color: "white",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Video Options
        </Typography>
      </Box>

      {/* Content */}
      <Stack spacing={1.5} sx={{ p: 2.5 }}>
        {/* Toggle Descriptions (public) */}
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

        {/* Ask AI (public, but pass safe username; you can also gate it if needed) */}
        <AskAI
          videoID={video_id}
          timeStamp={time}
          videoUrl={videoUrl}
          videoAD={videoDescriptions}
          username={username ?? "Guest"}
        />

        {/* Edit Descriptions (protected) */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<EditIcon />}
          onClick={handleEditDescriptions}
          disabled={!isAuthed}
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
          {isAuthed ? "Edit descriptions" : "Login to edit descriptions"}
        </Button>

        {/* (Optional) Add descriptions button if you use it */}
        {/* <Button
          variant="outlined"
          fullWidth
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddDescriptions}
          disabled={!isAuthed}
          sx={{ py: 1.5, px: 2.5, textTransform: "none" }}
        >
          {isAuthed ? "Add descriptions" : "Login to add descriptions"}
        </Button> */}

        {/* Share Video (public) */}
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
