import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useVideos } from '../context/VideoContext';
import { useParams } from "react-router-dom";
import SideNav from '../components/SideNav';
import Navbar from '../components/Navbar';
import Videos from '../components/Videos';

const drawerWidth = 240;

interface Video {
  id: string | number;
  title: string;
  [key: string]: unknown;
}

interface UseVideosResult {
  videoList: Video[];
  isLoading: boolean;
  error: unknown;
  refetchVideos: () => void | Promise<void>;
}

const Search: React.FC = () => {
  const { searchQuery } = useParams<{ searchQuery: string }>();
  const { videoList, isLoading } = useVideos() as UseVideosResult;
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  useEffect(() => {
    console.log("Search Query:", searchQuery, videoList);
    if (searchQuery && videoList.length > 0) {
      const filtered = videoList.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos([]);
    }
  }, [videoList, searchQuery]);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideNav />
      <Box
        component="main"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, height: "100vh" }}
      >
        <Navbar />
        <Box 
          m={2} 
        >
          <Typography 
            variant="h3" 
            className="heading-highlighted"
            tabIndex={0}
            aria-label={`Search results for ${searchQuery}`}
          >
            Search Results
          </Typography>
        </Box>

        {/* {searchQuery && (
          <Box m={2}>
            <Typography 
              variant="h6" 
              component="h2"
              color="text.secondary"
              tabIndex={0}
              aria-label={`Searching for: ${searchQuery}`}
            >
              Searching for: "{searchQuery}"
            </Typography>
          </Box>
        )} */}

        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px' 
            }}
            role="status"
            aria-live="polite"
            aria-label="Loading search results"
          >
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : filteredVideos.length > 0 ? (
          <Videos videos={filteredVideos} />
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px',
              p: 3
            }}
            role="status"
            aria-live="polite"
            aria-label="No search results found"
          >
            <Typography 
              variant="h6" 
              color="text.secondary"
              tabIndex={0}
            >
              No videos found for "{searchQuery}"
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Search;