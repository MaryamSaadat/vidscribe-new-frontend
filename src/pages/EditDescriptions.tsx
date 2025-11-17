import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Grid, TextField, Button } from "@mui/material";
import SideNav from "../components/SideNav";
import Navbar from "../components/Navbar";
import Scene from "../components/Scene";
import { useLocation, Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";

interface LocationState {
  video_id: string;
  videoUrl: string;
  youtubeID?: string;
  title: string;
}

const drawerWidth = 200;

const EditDescriptions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [yesFrame, setYesFrame] = useState<boolean>(false);
  const [played, setPlayed] = useState<number>(0);
  const [videoDescriptions, setVideoDescriptions] = useState<any[]>([]);

  const location = useLocation();
  const { video_id, videoUrl, youtubeID, title } = location.state as LocationState;
  console.log("These are my video ids and paths", video_id, videoUrl, youtubeID);

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
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 6 }}>
              {youtubeID ? (
                // <YoutubeVideoPlayer
                //   yesDesc={false}
                //   path={ensureVideoUrlFormat(video_path)}
                //   parentCallback={handleCallback}
                //   descrip={null}
                //   videoID={ensureVideoId(youtubeID)}
                // />
                <></>
              ) : (
                <VideoPlayer
                  yesDesc={false}
                  videoUrl={videoUrl}
                  title={title}
                  descrip={null}
                  parentCallback={handleCallback}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: "80vh", overflowY: "auto" }}>
              <Scene id={video_id} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default EditDescriptions;