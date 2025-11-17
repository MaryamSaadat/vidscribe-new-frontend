import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { ThemeProvider, CssBaseline } from '@mui/material';        // ok for CssBaseline
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'; // provider here
import { theme } from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';
import AboutPage from './pages/AboutPage';
import UploadVideo from "./pages/UploadVideo";
import VideoPage from "./pages/VideoPage";
import { VideoProvider } from "./context/videoContext";


const client = generateClient<Schema>();

function App() {

  return (
    <MUIThemeProvider theme={theme}>
      <VideoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/AboutPage" element={<AboutPage />} />
            <Route path="/UploadVideo" element={<UploadVideo />} />
            <Route path="/VideoPage/:video_id" element={<VideoPage />} />
          </Routes>
        </BrowserRouter>
      </VideoProvider>
    </MUIThemeProvider>
  );
}

export default App;
