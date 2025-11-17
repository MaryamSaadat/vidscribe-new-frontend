import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { ThemeProvider, CssBaseline, Box } from '@mui/material';        // ok for CssBaseline
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'; // provider here
import { theme } from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';
import AboutPage from './pages/AboutPage';
import UploadVideo from "./pages/UploadVideo";
import VideoPage from "./pages/VideoPage";
import UploadURL from "./pages/UploadUrl";
import EditDescriptions from "./pages/EditDescriptions";
import { VideoProvider } from "./context/videoContext";
import { Authenticator } from '@aws-amplify/ui-react';
import { defaultDarkModeOverride } from '@aws-amplify/ui-react';

const amplifyTheme = {
  name: "custom-theme",
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: "light",
      tokens: {
        colors: {
          brand: {
            primary: {
              // Define your primary brand color
              value: '#6A1B9A', // Purple
            },
          },
          // You can override other color tokens like background, text, etc.
          background: {
            primary: {
              value: 'pink', // Light purple background
            },
          },
        },
      },
    },
  ],
};


const components = {
  Header() {
    return (
      <img
        alt="VidScribe Logo"
        src="src/utils/Logo.png"
        style={{
          width: 400,
          margin: "20px auto",
          display: "block"
        }}
      />
    );
  },
};



const client = generateClient<Schema>();

function App() {

  return (
    <MUIThemeProvider theme={theme}>
      <Box className="pattern">
        <VideoProvider>
          <BrowserRouter>
            <Authenticator components={components} theme={amplifyTheme}>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/AboutPage" element={<AboutPage />} />
                <Route path="/UploadVideo" element={<UploadVideo />} />
                <Route path="/VideoPage/:video_id" element={<VideoPage />} />
                <Route path="/UploadUrl" element={<UploadURL />} />
                <Route path="/EditDescriptions" element={<EditDescriptions />} />
              </Routes>
            </Authenticator>
          </BrowserRouter>
        </VideoProvider>
      </Box>
    </MUIThemeProvider>
  );
}

export default App;
