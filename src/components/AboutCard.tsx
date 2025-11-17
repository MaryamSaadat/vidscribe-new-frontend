import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { 
  Language as WebsiteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material';

interface MediaCardProps {
  image: string;
  name: string;
  info: string;
  site?: string;
  zoom?: boolean;
  email?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  image, 
  name, 
  info, 
  site, 
  zoom = false,
  email 
}) => {
  const theme = useTheme();

  const handleNameClick = (): void => {
    if (site) {
      window.open(site, '_blank', 'noopener,noreferrer');
    }
  };


  return (
    <Card 
      sx={{ 
        maxWidth: 220, 
        minWidth: 220,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          borderColor: theme.palette.primary.main,
        },
      }}
      role="article"
      aria-label={`Team member: ${name}`}
    >
      {/* Image Section with Overlay */}
      <Box
        sx={{
          position: 'relative',
          height: 150,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: zoom ? '160%' : 'cover',
            backgroundPosition: zoom ? '50% 0%' : 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          role="img"
          aria-label={`Photo of ${name}`}
        />
      </Box>

      {/* Content Section */}
      <CardContent 
        sx={{ 
          p: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="subtitle1"
          onClick={handleNameClick}
          sx={{
            fontWeight: 600,
            cursor: site ? 'pointer' : 'default',
            color: 'text.primary',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: site ? 'primary.main' : 'inherit',
              textDecoration: site ? 'underline' : 'none',
            },
          }}
          aria-label={site ? `${name}, click to visit website` : name}
        >
          {name}
        </Typography>

        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ 
            fontSize:'0.7em',
            minHeight: '2em',
          }}
        >
          {info}
        </Typography>

        {site && (
              <IconButton
                onClick={handleNameClick}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease',
                }}
                aria-label={`Visit ${name}'s website`}
              >
                <WebsiteIcon fontSize="small" />
              </IconButton>
            )}
      </CardContent>
    </Card>
  );
};

export default MediaCard;