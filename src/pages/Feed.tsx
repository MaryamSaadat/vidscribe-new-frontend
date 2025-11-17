import { Box, Typography } from '@mui/material';
import Videos from '../components/Videos';
import { useVideos } from '../context/VideoContext';
import SideNav from '../components/SideNav';
import Navbar from '../components/Navbar';

const drawerWidth = 240;

type Video = {
  id: string | number;
  [key: string]: unknown;
};

type UseVideosResult = {
  videoList: Video[];
  isLoading: boolean;
  error: unknown;
  refetchVideos: () => void | Promise<void>;
};

export default function Feed() {
  const { videoList, isLoading } = useVideos() as UseVideosResult;

  return (
    <Box sx={{ display: 'flex' }}>
      <SideNav />
      <Box
        component="main"
        sx={{ width: { sm: `calc(1400px - ${drawerWidth}px)` }, height: '100vh' }}
      >
        <Navbar />
        <Box m={2}>
          <Typography 
            variant="h3" 
            className="heading-highlighted"
            tabIndex={0}
            aria-label="Recently Described Videos section"
          >
            Recently Described Videos
          </Typography>
        </Box>

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
            aria-label="Loading videos"
          >
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : (
          <Videos videos={videoList} />
        )}
      </Box>
    </Box>
  );
}