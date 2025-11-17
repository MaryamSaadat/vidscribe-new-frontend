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
  const { videoList, isLoading } =
    useVideos() as UseVideosResult;


  return (
    <Box sx={{ display: 'flex' }}>
      <SideNav />
      <Box
        component="main"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, height: '100vh' }}
      >
        <Navbar />
        <Box
          m={2}
          sx={{
            backgroundColor: 'secondary.main',
            p: '0 10px',
            display: 'inline-block',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Recently Described Videos
          </Typography>
        </Box>

        {isLoading ? <div>Loading...</div> : <Videos videos={videoList} />}
      </Box>
    </Box>
  );
}
