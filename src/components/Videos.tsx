import React, { useState } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
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

const PAGE_SIZE = 40;

const Videos: React.FC<VideosProps> = ({ videos }) => {
  const [page, setPage] = useState(1);

  console.log('these are the props', videos.length);

  // sort like before
  const reversedVideos: Video[] = [...videos].sort((a, b) => {
    const na = Number(a.id);
    const nb = Number(b.id);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return nb - na;
    }
    return String(b.id).localeCompare(String(a.id));
  });

  const totalPages = Math.ceil(reversedVideos.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentVideos = reversedVideos.slice(start, start + PAGE_SIZE);

  return (
    <>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="start"
        alignItems="start"
        columnGap={2}
        gap={2}
        m={2}
      >
        {currentVideos.map((item: Video, idx: number) => (
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

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mb={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
};

export default Videos;