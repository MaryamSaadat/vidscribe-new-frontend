import React, { useState } from 'react';
import { formatDuration } from '../utils/constants';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Avatar,
  Stack,
  Skeleton,
} from '@mui/material';
import { PlayCircleOutline, AccessTime, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string | number;
  duration?: number;
  username?: string;
  title: string;
  thumbnailImage: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  id, 
  duration, 
  username, 
  title, 
  thumbnailImage 
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
//   console.log('VideoCard props:', { id, duration, username, title, thumbnailImage });
  const video_id = id;

  const handleHover = (): void => {
    setHovered(true);
  };

  const handleMouseLeave = (): void => {
    setHovered(false);
  };

  return (
    <Link to={`/VideoPage/${video_id}`}>
      <Card
        sx={{
          maxWidth: 345,
          backgroundColor: 'transparent',
          width: { xs: '100%', sm: '350px', md: '270px' },
          boxShadow: 'none',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail Section */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={180}
              animation="wave"
            />
          )}

          <CardMedia
            component="img"
            image={thumbnailImage}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
            }}
          />

          {/* Duration Badge */}
          {/* {duration && (
            <Chip
              icon={<AccessTime sx={{ fontSize: 14 }} />}
              label={formatDuration(duration)}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 35,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600,
                height: 24,
                '& .MuiChip-icon': {
                  color: 'white',
                  marginLeft: '4px',
                },
              }}
            />
          )} */}
        </Box>
        <CardContent>
          <Box
            sx={{
              position: 'relative',
              top: '-40px',
              bgcolor: '#FFFFFF',
              width: 'calc(100% - 20px)',
              minHeight: '110px',
              padding: '10px',
              boxShadow: '0px 4px 4px 4px rgba(0, 0, 0, 0.1)',
              zIndex: 1,
            }}
          >
            <Typography variant="body1" component="div" gutterBottom>
              {title.slice(0, 60)}
            </Typography>
            <Box
              sx={{
                pt: 1,
                display: 'flex',
                alignItems: 'center',
                color: hovered ? 'primary.main' : 'text.secondary',
                transition: 'color 0.2s',
              }}
            >
              <PlayCircleOutline sx={{ fontSize: 18, mr: 0.5 }} />
              Watch video
            </Box>
          </Box>
        </CardContent>
      </Card>
      </Link>
  );
};

export default VideoCard;