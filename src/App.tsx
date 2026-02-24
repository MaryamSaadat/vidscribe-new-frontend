import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { theme } from "./theme";
import Feed from "./pages/Feed";
import AboutPage from "./pages/AboutPage";
import VideoPage from "./pages/VideoPage";
import UploadVideo from "./pages/UploadVideo";
import UploadURL from "./pages/UploadUrl";
import EditDescriptions from "./pages/EditDescriptions";
import Search from "./pages/Search";
import Login from "./pages/Login";

import { VideoProvider } from "./context/VideoContext";
import { TextToSpeechProvider } from "./context/TexttoSpeechContext";
import RequireAuth from "./components/RequireAuth";
import { Authenticator } from "@aws-amplify/ui-react";

function App() {
  return (
    <MUIThemeProvider theme={theme}>
      <Box className="pattern" sx={{ minHeight: "100vh" }}>
        <VideoProvider>
          <TextToSpeechProvider>
            <Authenticator.Provider>
              <BrowserRouter>
                <Routes>
                  {/* ✅ Public */}
                  <Route path="/" element={<Feed />} />
                  <Route path="/AboutPage" element={<AboutPage />} />
                  <Route path="/VideoPage/:video_id" element={<VideoPage />} />

                  {/* ✅ Login */}
                  <Route path="/login" element={<Login />} />

                  {/* 🔒 Protected */}
                  <Route
                    path="/UploadVideo"
                    element={
                      <RequireAuth>
                        <UploadVideo />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/UploadUrl"
                    element={
                      <RequireAuth>
                        <UploadURL />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/EditDescriptions"
                    element={
                      <RequireAuth>
                        <EditDescriptions />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/video-search/:searchQuery"
                    element={
                      <RequireAuth>
                        <Search />
                      </RequireAuth>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </Authenticator.Provider>
          </TextToSpeechProvider>
        </VideoProvider>
      </Box>
    </MUIThemeProvider>
  );
}

export default App;
