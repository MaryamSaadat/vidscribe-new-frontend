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
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SideNav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <Navbar />
        
        {/* Content area - takes remaining space after Navbar */}
        <Box 
          sx={{ 
            flexGrow: 1,
            p: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              height: "100%",
              flexGrow: 1,
              margin: 0,
              width: "100%"
            }}
          >
            {/* Video Column */}
            <Grid 
              size={{ xs: 12, md: 6 }} 
              sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <Box sx={{ height: "100%", overflow: "hidden" }}>
                <VideoPlayer
                  yesDesc={false}
                  presignedUrl={videoUrl || ""}
                  youtubeUrl={youtubeID}
                  title={title}
                  descriptionList={[]}
                  parentCallback={handleCallback}
                />
              </Box>
            </Grid>

            {/* Scene Column - ONLY this scrolls */}
            <Grid 
              size={{ xs: 12, md: 6 }} 
              sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <Box 
                sx={{ 
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 1  // Padding for scrollbar
                }}
              >
                <Scene id={video_id} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default EditDescriptions;