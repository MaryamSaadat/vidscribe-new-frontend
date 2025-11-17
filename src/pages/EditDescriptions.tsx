import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Grid, TextField, Button } from "@mui/material";
import { Sidebar, VideoPlayer, Scene, Navbar, Notes, Frame, SideNav, YoutubeVideoPlayer } from "../components/";
import { useLocation, Link } from "react-router-dom";

interface LocationState {
  video_id: string;
  video_path: string;
  youtubeID?: string;
}

const drawerWidth = 200;

function ensureVideoUrlFormat(url: string | null | undefined): string | null {
  // Check if url is null or undefined
  if (url == null) {
    console.error("Error: URL is null or undefined");
    return null; // Return null in case of error
  }

  // Check if the URL already starts with "videos/"
  if (!url.startsWith("videos/")) {
    // If not, prepend "videos/" to the URL
    url = "videos/" + url;
  }
  return url;
}

function ensureVideoId(url: string | undefined): string | null {
  if (url && url !== "") {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|.*[&?]))([^&?\s]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

const EditDescriptions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [yesFrame, setYesFrame] = useState<boolean>(false);
  const [played, setPlayed] = useState<number>(0);
  const [videoDescriptions, setVideoDescriptions] = useState<any[]>([]);

  const location = useLocation();
  const { video_id, video_path, youtubeID } = location.state as LocationState;
  console.log("These are my video ids and paths", video_id, video_path, youtubeID);

  // this function just retrives the time the video is played
  const handleCallback = (progressData: number): void => {
    setPlayed(progressData);
  };

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <SideNav />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Navbar />
          <Grid container>
            <Grid item xs={12} md={8}>
              {youtubeID ? (
                <YoutubeVideoPlayer
                  yesDesc={false}
                  path={ensureVideoUrlFormat(video_path)}
                  parentCallback={handleCallback}
                  descrip={null}
                  videoID={ensureVideoId(youtubeID)}
                />
              ) : (
                <VideoPlayer
                  yesDesc={false}
                  path={ensureVideoUrlFormat(video_path)}
                  descrip={null}
                  parentCallback={handleCallback}
                />
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Scene id={video_id} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default EditDescriptions;