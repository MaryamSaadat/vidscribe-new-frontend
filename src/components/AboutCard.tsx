import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

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
  zoom = false 
}) => {
  const handleNameClick = (): void => {
    if (site) {
      window.open(site, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card sx={{ maxWidth: 250, minWidth: 250 }}>
      <div
        style={{
          height: 200,
          backgroundImage: `url(${image})`,
          backgroundSize: zoom ? '180%' : 'contain',
          backgroundPosition: zoom ? '50% 0%' : 'center',
          backgroundRepeat: 'no-repeat',
        }}
        title="Image of one of the collaborators for the project"
        role="img"
        aria-label={`Photo of ${name}`}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          onClick={handleNameClick}
          sx={{
            cursor: site ? 'pointer' : 'default',
            '&:hover': {
              color: site ? 'primary.main' : 'inherit',
            },
          }}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {info}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MediaCard;