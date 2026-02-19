import React from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import VideoCard from './VideoCard';
import { useVideos } from '../context/VideoContext';

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
  const { page, setPage, paginationMeta } = useVideos();

  // Sort descending by id
  const sortedVideos: Video[] = [...videos].sort((a, b) => {
    const na = Number(a.id);
    const nb = Number(b.id);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
    return String(b.id).localeCompare(String(a.id));
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {sortedVideos.map((item: Video, idx: number) => (
          <VideoCard
            key={item.id ?? idx}
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

      {paginationMeta && paginationMeta.total_pages > 1 && (
        <Box display="flex" justifyContent="center" mb={4}>
          <Pagination
            count={paginationMeta.total_pages}
            page={page}
            onChange={handlePageChange}
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