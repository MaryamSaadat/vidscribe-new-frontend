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

// Define a minimal shape for a video until you have your real one
type Video = Record<string, unknown>;

type VideoContextType = {
  videoList: Video[];
  isLoading: boolean;
  error: string;
  refetchVideos: () => Promise<void>;
};

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
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;
  const apiUrl = GET_VIDEOS;

  const fetchVideos = useCallback(
    async (force = false) => {
      if (!force && lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.get(apiUrl);
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
        setLastFetched(Date.now());
      } catch (err) {
        console.error(err);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, lastFetched]
  );

  useEffect(() => {
    void fetchVideos();
  }, [fetchVideos]);

  const refetchVideos = useCallback(() => fetchVideos(true), [fetchVideos]);

  return (
    <VideoContext.Provider
      value={{
        videoList,
        isLoading,
        error,
        refetchVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
