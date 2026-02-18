import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { GET_VIDEOS } from '../utils/constants';
import axios from 'axios';

type Video = Record<string, unknown>;

type PaginationMeta = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

type VideoContextType = {
  videoList: Video[];
  isLoading: boolean;
  error: string;
  page: number;
  setPage: (page: number) => void;
  paginationMeta: PaginationMeta | null;
  refetchVideos: () => Promise<void>;
};

const PAGE_SIZE = 40; // Change this to update default page size

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within VideoProvider');
  }
  return context;
};

type Props = { children: ReactNode };

export const VideoProvider: React.FC<Props> = ({ children }) => {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  const fetchVideos = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(GET_VIDEOS, {
        params: {
          page: currentPage,
          page_size: PAGE_SIZE,
        },
      });

      const items = Array.isArray(response?.data?.videos)
        ? response.data.videos
        : [];

      const parsed = items
        .map((item) => {
          try {
            return typeof item === 'string' ? JSON.parse(item) : item;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as Video[];

      setVideoList(parsed);
      setPaginationMeta(response.data.pagination ?? null);
    } catch (err) {
      console.error(err);
      setError('Failed to load videos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever page changes
  useEffect(() => {
    void fetchVideos(page);
  }, [page, fetchVideos]);

  const refetchVideos = useCallback(() => fetchVideos(page), [fetchVideos, page]);

  return (
    <VideoContext.Provider
      value={{
        videoList,
        isLoading,
        error,
        page,
        setPage,
        paginationMeta,
        refetchVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};