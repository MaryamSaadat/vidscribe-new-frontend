import React from 'react';
import { Stack, Box } from '@mui/material';
import VideoCard  from './VideoCard';

interface Video {
  id: string | number;
  video_length?: number;
  username?: string;
  title: string;
  thumbnail_presigned_url?: string;
}

interface VideosProps {
  videos: Video[];
}

const Videos: React.FC<VideosProps> = ({ videos }) => {
  console.log('these are the props', videos);
  
  // Reverse the array to display videos in a Last In, First Out (LIFO) order
  const reversedVideos: Video[] = [...videos].reverse();

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="start"
      alignItems="start"
      columnGap={2}
      m={2}
    >
      {reversedVideos.map((item: Video, idx: number) => (
        <VideoCard
          key={idx}
          id={item.id}
          duration={item.video_length}
          username={item.username}
          title={item.title}
          thumbnailImage={
            item.thumbnail_presigned_url 
              ? item.thumbnail_presigned_url 
              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg'
          }
        />
      ))}
    </Stack>
  );
};

export default Videos;