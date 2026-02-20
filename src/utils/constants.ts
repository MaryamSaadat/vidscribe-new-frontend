import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PollIcon from '@mui/icons-material/Poll';

import type { ElementType } from 'react';

import maryamImage from './images/maryam.jpeg';
import sinaImage from './images/sina.jpeg';
import samImage from './images/sam.jpg';
import RushitImage from './images/Rushit.jpg';

// Logo path
export const logo = './viLogo.png' as const;
export const DRAWERWIDTH = 200;

// Environment variables with runtime validation
function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (typeof value !== 'string') {
    throw new Error(`Environment variable ${key} is not defined or not a string`);
  }
  return value;
}

export const GET_VIDEOS: string = getEnvVar('VITE_GET_VIDEOS');
export const GET_VIDEO_DESCRIPTIONS: string = getEnvVar('VITE_GET_DECRIPTIONS');
export const GENERATE_URL: string = getEnvVar('VITE_GENERATE_URL');
export const PROCESS_FILE_URL: string = getEnvVar('VITE_PROCESS_FILE_URL');
export const DESCRIPTIONS_EDIT_API: string = getEnvVar('VITE_DESCRIPTIONS_EDIT_API');
export const ASK_AI_API: string = getEnvVar('VITE_ASK_QUESTION_API');
export const PROCESS_YOUTUBE_FILE_URL: string = getEnvVar('VITE_PROCESS_YOUTUBE_VIDEO');

// Format duration helper with explicit return type
export const formatDuration = (secondsFloat: number): string => {
  if (typeof secondsFloat !== 'number' || !isFinite(secondsFloat) || secondsFloat < 0) {
    return '00:00';
  }
  const total = Math.floor(secondsFloat);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${mm}:${ss}`;
};

// Types
export type Category = {
  readonly name: string;
  readonly icon: ElementType;
  readonly href: string;
};

export type Person = {
  readonly image: string;
  readonly name: string;
  readonly info: string;
  readonly zoom?: boolean;
  readonly email?: string;
  readonly site?: string;
};

export const contributors = [
    'Sejal Jain', 'Nimeesh Milind Mahajan', 'Kerry Zhuo', 'Anuj Nathan Kamasamudram',
    'Saanvi Agrawal', 'Adam Colyar', 'Yasmine Muraweh', 'Asish Panda',
    'Andrew Mitchell'
];

// Immutable arrays with as const assertion
export const categories: readonly Category[] = [
  { name: 'Home', icon: HomeIcon, href: '/' },
  { name: 'Upload Video', icon: FileUploadIcon, href: '/UploadVideo' },
  { name: 'Youtube Video', icon: YouTubeIcon, href: '/UploadUrl' },
  // { name: 'End of Day Survey', icon: PollIcon, href: 'https://docs.google.com/forms/d/e/1FAIpQLSe9vQDfVJgX_nFQCYinCRkezQIrPwj4dbsaWZLDm_fYTrErzA/viewform?usp=dialog' },
  // { name: 'End of Week (Final) Survey', icon: PollIcon, href: 'https://docs.google.com/forms/u/1/d/1W9iYuSzSk5YBJuRZnrSE0AcOKfOpU7Pi7LK4iGEZh1M/edit?usp=sharing_eil_se_dm&ts=69262947' },
  { name: 'About ViDScribe', icon: YouTubeIcon, href: '/AboutPage' },
] as const;

export const people: readonly Person[] = [
  {
    image: maryamImage,
    name: 'Maryam S Cheema',
    info: 'Arizona State University',
    site:'https://maryamsaadat.github.io/',
    zoom: false,
  },
  {
    image: sinaImage,
    name: 'Sina Elahimanesh',
    info: 'Saarland University',
    site:'https://www.sina-elahimanesh.com/',
    zoom: true,
  },
    {
    image: samImage,
    name: 'Samuel Martin',
    info: 'Arizona State University',
  },
  {
    image: RushitImage,
    name: 'Rushit Kothari',
    info: 'Arizona State University',
    site:'https://rush3103.github.io/Rushit-Portfolio/Rushit-Portfolio.html',
    zoom: false,
  },
  {
    image:
      'https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=IAD0fQQAAAAJ&citpid=6',
    name: 'Hasti Seifi',
    info: 'Arizona State University',
    email: 'hasti.seifi@asu.edu',
    site: 'https://hastiseifi.com/',
    zoom: false,
  },
  {
    image: 'https://pooyanfazli.com/images/PooyanFazli.jpg',
    name: 'Pooyan Fazli',
    info: 'Arizona State University.',
    email: 'pooyan@asu.edu',
    site: 'https://pooyanfazli.com/',
    zoom: false,
  },
] as const;

export const aboutWebsite: readonly string[] = [
  'Welcome to ViDScribe, a platform designed to empower blind and low vision users by providing AI-generated audio descriptions for videos and allowing users to ask questions about the content.',
  'On ViDScribe, you can upload videos or paste a YouTube link to receive descriptions. Once processed, the described video will appear on your homepage. Our goal with ViDScribe is to foster inclusivity and ensure equal access to information for blind and low vision users.',
] as const;

export type VideoCardProps = {
  id: number;
  duration?: number;
  username?: string;
  title: string;
  thumbnailImage: string;
};

export function formatTime(seconds) {
  if (isNaN(seconds)) {
    return "";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  if (hours === 0)
  {
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
