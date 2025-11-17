import React, { useState } from 'react';
import { formatDuration } from '../utils/constants';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Skeleton,
  IconButton,
  Paper,
} from '@mui/material';
import { PlayCircleOutline, AccessTime, Person } from '@mui/icons-material';
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
  const video_id = id;

  const handleHover = (): void => {
    setHovered(true);
  };

  const handleMouseLeave = (): void => {
    setHovered(false);
  };

  return (
    <Link 
      to={`/VideoPage/${video_id}`}
      style={{ textDecoration: 'none' }}
      aria-label={`Watch video: ${title}`}
    >
      <Card
        sx={{
          maxWidth: 345,
          width: { xs: '100%', sm: '320px', md: '270px' },
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: hovered 
            ? '0 12px 24px rgba(0, 0, 0, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail Section */}
        <Box 
          sx={{ 
            position: 'relative', 
            overflow: 'hidden',
            paddingTop: '56.25%', // 16:9 aspect ratio
            bgcolor: 'grey.200'
          }}
        >
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}

          <CardMedia
            component="img"
            image={thumbnailImage}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
              transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <Paper
            sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                bgcolor: 'primary.dark',
                color: 'white',
                backdropFilter: 'blur(4px)',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
          >
            <Typography p={0.5} variant='caption'>
              {duration ? formatDuration(duration) : '00:00'}
            </Typography>
          </Paper>
          
          {/* Play Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          >
            <IconButton
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 64,
                height: 64,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                transform: hovered ? 'scale(1)' : 'scale(0.8)',
                transition: 'transform 0.3s ease',
              }}
              aria-label="Play video"
            >
              <PlayCircleOutline sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ p: 2.5 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.4,
              mb: 1.5,
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.8em',
            }}
          >
            {title}
          </Typography>

          {/* Username */}
          {username && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                mb: 1.5,
              }}
            >
              <Person sx={{ fontSize: 18 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {username}
              </Typography>
            </Box>
          )}

          {/* Watch CTA */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: hovered ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s ease',
              pt: 1,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <PlayCircleOutline 
              sx={{ 
                fontSize: 20,
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.02em',
              }}
            >
              Watch Video
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VideoCard;