// import React, { useState, useEffect } from 'react';
// import { 
//     Stack, 
//     Button, 
//     IconButton, 
//     Paper, 
//     InputBase, 
//     Box,
//     Avatar,
//     Tooltip,
//     Badge,
//     useTheme,
//     alpha
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import LogoutIcon from '@mui/icons-material/Logout';
// import LoginIcon from '@mui/icons-material/Login';
// import PersonIcon from '@mui/icons-material/Person';
// import { fetchAuthSession } from 'aws-amplify/auth';
// import { useAuthenticator } from '@aws-amplify/ui-react';

// const Navbar: React.FC = () => {
//     const theme = useTheme();
//     const [session, setSession] = useState<any | null>(null);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const { signOut, user } = useAuthenticator();

//     useEffect(() => {
//         let mounted = true;
//         async function loadSession() {
//             try {
//                 const s = await fetchAuthSession();
//                 if (!mounted) return;
//                 setSession(s);
//                 setIsLoggedIn(Boolean(s?.tokens?.idToken));
//             } catch (err) {
//                 console.error('Failed to fetch session', err);
//             }
//         }
//         loadSession();
//         return () => {
//             mounted = false;
//         };
//     }, []);

//     // Get user initials for avatar
//     const getUserInitials = (): string => {
//         if (!user) return 'U';
//         const name = user.signInDetails.loginId || 'User';
//         return name.charAt(0).toUpperCase();
//     };

//     return (
//         <Box
//             component="nav"
//             role="navigation"
//             aria-label="Main navigation"
//             sx={{
//                 position: 'sticky',
//                 top: 0,
//                 zIndex: 1100,
//                 bgcolor: 'background.paper',
//                 borderBottom: `1px solid ${theme.palette.divider}`,
//                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
//             }}
//         >
//             <Stack
//                 direction="row"
//                 alignItems="center"
//                 spacing={2}
//                 sx={{
//                     px: { xs: 2, md: 4 },
//                     py: 1.5,
//                     justifyContent: 'space-between',
//                 }}
//             >
//                 {/* Search Bar */}
//                 <Paper
//                     component="form"
//                     elevation={0}
//                     onSubmit={(e) => e.preventDefault()}
//                     sx={{
//                         p: '4px 8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         width: { xs: '100%', sm: 400 },
//                         maxWidth: 500,
//                         border: `1px solid ${theme.palette.divider}`,
//                         borderRadius: 2,
//                         transition: 'all 0.2s ease',
//                         '&:hover': {
//                             borderColor: theme.palette.primary.main,
//                             boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
//                         },
//                         '&:focus-within': {
//                             borderColor: theme.palette.primary.main,
//                             boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
//                         },
//                     }}
//                     role="search"
//                 >
//                     <IconButton
//                         type="submit"
//                         sx={{ p: 1, color: 'text.secondary' }}
//                         aria-label="Search for described videos"
//                     >
//                         <SearchIcon />
//                     </IconButton>
//                     <InputBase
//                         sx={{ 
//                             ml: 1, 
//                             flex: 1,
//                             fontSize: '0.95rem',
//                         }}
//                         placeholder="Search described videos..."
//                         inputProps={{ 
//                             'aria-label': 'Search described videos',
//                         }}
//                     />
//                 </Paper>

//                 {/* User Actions */}
//                 <Stack direction="row" spacing={1.5} alignItems="center">
//                     {isLoggedIn ? (
//                         <>
//                             {/* User Avatar */}
//                             <Tooltip title={user?.signInDetails.loginId || 'User profile'}>
//                                 <Badge
//                                     overlap="circular"
//                                     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                                     variant="dot"
//                                     sx={{
//                                         '& .MuiBadge-badge': {
//                                             backgroundColor: '#44b700',
//                                             color: '#44b700',
//                                             boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//                                             '&::after': {
//                                                 position: 'absolute',
//                                                 top: 0,
//                                                 left: 0,
//                                                 width: '100%',
//                                                 height: '100%',
//                                                 borderRadius: '50%',
//                                                 animation: 'ripple 1.2s infinite ease-in-out',
//                                                 border: '1px solid currentColor',
//                                                 content: '""',
//                                             },
//                                         },
//                                         '@keyframes ripple': {
//                                             '0%': {
//                                                 transform: 'scale(.8)',
//                                                 opacity: 1,
//                                             },
//                                             '100%': {
//                                                 transform: 'scale(2.4)',
//                                                 opacity: 0,
//                                             },
//                                         },
//                                     }}
//                                 >
//                                     <Avatar
//                                         sx={{
//                                             width: 36,
//                                             height: 36,
//                                             bgcolor: 'primary.main',
//                                             fontSize: '1rem',
//                                             fontWeight: 600,
//                                             cursor: 'pointer',
//                                             transition: 'all 0.2s ease',
//                                             '&:hover': {
//                                                 transform: 'scale(1.05)',
//                                                 boxShadow: 2,
//                                             },
//                                         }}
//                                         aria-label={`Logged in as ${user?.username || 'user'}`}
//                                     >
//                                         {getUserInitials()}
//                                     </Avatar>
//                                 </Badge>
//                             </Tooltip>

//                             {/* Sign Out Button */}
//                             <Tooltip title="Sign out of your account">
//                                 <Button
//                                     variant="outlined"
//                                     onClick={() => signOut()}
//                                     startIcon={<LogoutIcon />}
//                                     sx={{
//                                         textTransform: 'none',
//                                         '&:hover': {
//                                             borderColor: 'error.main',
//                                             color: 'error.main',
//                                             bgcolor: alpha(theme.palette.error.main, 0.08),
//                                         },
//                                     }}
//                                     aria-label="Sign out of your account"
//                                 >
//                                     <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
//                                         Sign Out
//                                     </Box>
//                                 </Button>
//                             </Tooltip>
//                         </>
//                     ) : (
//                         <Tooltip title="Sign in to access all features">
//                             <Button
//                                 variant="contained"
//                                 startIcon={<LoginIcon />}
//                                 sx={{
//                                     textTransform: 'none',
//                                     fontWeight: 600,
//                                     borderRadius: 2,
//                                     px: 3,
//                                     boxShadow: 'none',
//                                     '&:hover': {
//                                         boxShadow: 2,
//                                         transform: 'translateY(-1px)',
//                                     },
//                                     transition: 'all 0.2s ease',
//                                 }}
//                                 aria-label="Sign in to your account"
//                             >
//                                 Sign In
//                             </Button>
//                         </Tooltip>
//                     )}
//                 </Stack>
//             </Stack>
//         </Box>
//     );
// };

// export default Navbar;


import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import LinkIcon from '@mui/icons-material/Link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { categories } from '../utils/constants';
import { Link, useLocation } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import logo from '../utils/Logo.png';
import type { Category } from '../utils/constants';

const drawerWidth = 240;

interface ResponsiveDrawerProps {
  window?: () => Window;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

interface SessionData {
  sessionId: string;
  startTime: string;
  endTime?: string;
  pauses: Array<{
    pauseTime: string;
    resumeTime?: string;
  }>;
  status: 'active' | 'paused' | 'stopped';
  totalDuration?: number;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactElement> = {
  'Home': <HomeIcon />,
  'Upload Video': <UploadIcon />,
  'Youtube Video': <LinkIcon />,
};

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ 
  window: windowProp,
  selectedCategory,
  setSelectedCategory 
}) => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);
  const [sessionData, setSessionData] = React.useState<SessionData | null>(null);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const location = useLocation();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const announcementRef = React.useRef<HTMLDivElement>(null);
  
  // Get authenticated user
  const { user } = useAuthenticator();
  const username = user?.signInDetails?.loginId || 'unknown_user';

  // Screen reader announcement function
  const announceToScreenReader = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  // Load session from localStorage on mount
  React.useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSessionData(parsed);
        // Calculate elapsed time for both active and paused sessions
        const elapsed = calculateElapsedTime(parsed);
        setCurrentTime(elapsed);
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  // Timer effect
  React.useEffect(() => {
    if (sessionData?.status === 'active') {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionData?.status]);

  // Calculate elapsed time considering pauses
  const calculateElapsedTime = (session: SessionData): number => {
    const start = new Date(session.startTime).getTime();
    const now = Date.now();
    let totalPausedTime = 0;

    // Calculate total paused time from completed pauses
    session.pauses.forEach((pause) => {
      const pauseStart = new Date(pause.pauseTime).getTime();
      // Only count paused time for completed pauses (those with resumeTime)
      if (pause.resumeTime) {
        const pauseEnd = new Date(pause.resumeTime).getTime();
        totalPausedTime += pauseEnd - pauseStart;
      }
    });

    // If currently paused, calculate time up to the pause point (not including current pause duration)
    if (session.status === 'paused' && session.pauses.length > 0) {
      const lastPause = session.pauses[session.pauses.length - 1];
      if (!lastPause.resumeTime) {
        // Use the pause time as the "end" point for calculation
        const pauseStart = new Date(lastPause.pauseTime).getTime();
        return Math.floor((pauseStart - start - totalPausedTime) / 1000);
      }
    }

    // For active sessions, calculate up to now
    return Math.floor((now - start - totalPausedTime) / 1000);
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save session to DynamoDB via Lambda
  const saveSessionToDatabase = async (session: SessionData) => {
    setIsLoading(true);
    try {
      // Add username to session data
      const sessionWithUser = {
        ...session,
        username: username,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/sessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionWithUser),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      const result = await response.json();
      console.log('Session saved:', result);
      return result;
    } catch (error) {
      console.error('Error saving session:', error);
      announceToScreenReader('Error saving session. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Start session
  const handleStartSession = async () => {
    const newSession: SessionData = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
      pauses: [],
      status: 'active',
    };

    setSessionData(newSession);
    setCurrentTime(0);
    localStorage.setItem('userSession', JSON.stringify(newSession));
    announceToScreenReader('Session started successfully. Timer is now running.');

    try {
      await saveSessionToDatabase(newSession);
    } catch (error) {
      console.error('Error saving session start:', error);
    }
  };

  // Pause session
  const handlePauseSession = async () => {
    if (!sessionData) return;

    const updatedSession: SessionData = {
      ...sessionData,
      status: 'paused',
      pauses: [
        ...sessionData.pauses,
        {
          pauseTime: new Date().toISOString(),
        },
      ],
    };

    setSessionData(updatedSession);
    localStorage.setItem('userSession', JSON.stringify(updatedSession));
    announceToScreenReader(`Session paused at ${formatTime(currentTime)}. Timer stopped.`);

    try {
      await saveSessionToDatabase(updatedSession);
    } catch (error) {
      console.error('Error saving session pause:', error);
    }
  };

  // Resume session
  const handleResumeSession = async () => {
    if (!sessionData) return;

    const updatedPauses = [...sessionData.pauses];
    const lastPause = updatedPauses[updatedPauses.length - 1];
    if (lastPause && !lastPause.resumeTime) {
      lastPause.resumeTime = new Date().toISOString();
    }

    const updatedSession: SessionData = {
      ...sessionData,
      status: 'active',
      pauses: updatedPauses,
    };

    setSessionData(updatedSession);
    localStorage.setItem('userSession', JSON.stringify(updatedSession));
    announceToScreenReader('Session resumed. Timer is now running.');

    try {
      await saveSessionToDatabase(updatedSession);
    } catch (error) {
      console.error('Error saving session resume:', error);
    }
  };

  // Stop session
  const handleStopSession = async () => {
    if (!sessionData) return;

    const totalDuration = currentTime;
    const updatedSession: SessionData = {
      ...sessionData,
      endTime: new Date().toISOString(),
      status: 'stopped',
      totalDuration,
    };

    setSessionData(updatedSession);
    localStorage.setItem('userSession', JSON.stringify(updatedSession));
    announceToScreenReader(
      `Session stopped. Total duration: ${formatTime(totalDuration)}. Session data saved.`
    );

    try {
      await saveSessionToDatabase(updatedSession);
      setTimeout(() => {
        localStorage.removeItem('userSession');
        setSessionData(null);
        setCurrentTime(0);
        announceToScreenReader('Session cleared. You can start a new session.');
      }, 3000);
    } catch (error) {
      console.error('Error saving session stop:', error);
    }
  };

  const handleDrawerClose = (): void => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = (): void => {
    setIsClosing(false);
  };

  const handleDrawerToggle = (): void => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const getStatusColor = () => {
    switch (sessionData?.status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'stopped':
        return 'error';
      default:
        return 'default';
    }
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Screen reader live region for announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />

      {/* Logo Header */}
      <Box 
        sx={{ 
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 80
        }}
      >
        <Link 
          to="/" 
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }}
          aria-label="ViDScribe home"
        >
          <img 
            src={logo} 
            alt="ViDScribe Logo" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              maxHeight: '50px'
            }} 
          />
        </Link>
        {/* Close button for mobile */}
        <IconButton
          onClick={handleDrawerClose}
          sx={{ display: { sm: 'none' } }}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Navigation List */}
      <List 
        component="nav" 
        sx={{ flex: 1, pt: 2 }}
        aria-label="Navigation menu"
      >
        {categories.map((category: Category, idx: number) => {
          const isActive = location.pathname === category.href;
          
          return (
            <ListItem 
              key={category.name} 
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                component={Link}
                to={category.href}
                selected={isActive}
                onClick={() => {
                  if (setSelectedCategory) {
                    setSelectedCategory(category.name);
                  }
                  if (mobileOpen) {
                    handleDrawerClose();
                  }
                }}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                aria-label={`Navigate to ${category.name}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {categoryIcons[category.name] || <HomeIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary={category.name}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Session Control Section */}
      <Box 
        sx={{ p: 2 }}
        role="region"
        aria-label="Session control"
      >
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontWeight: 600 }}
          id="session-control-label"
        >
          Session Tracking
        </Typography>

        {/* Timer Display */}
        <Box
          sx={{
            bgcolor: 'background.default',
            p: 1.5,
            borderRadius: 1,
            mb: 1.5,
            textAlign: 'center',
          }}
        >
          <Stack spacing={0.5} alignItems="center">
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontFamily: 'monospace', 
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
              aria-label={`Elapsed time: ${formatTime(currentTime)}`}
              aria-live="off"
            >
              {formatTime(currentTime)}
            </Typography>
          </Stack>
        </Box>

        {/* Control Buttons */}
        <Stack spacing={1}>
          {!sessionData || sessionData.status === 'stopped' ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              startIcon={<PlayArrowIcon />}
              onClick={handleStartSession}
              disabled={isLoading}
              aria-label="Start new session"
              aria-describedby="session-control-label"
            >
              Start Session
            </Button>
          ) : (
            <>
              {sessionData.status === 'active' ? (
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  fullWidth
                  startIcon={<PauseIcon />}
                  onClick={handlePauseSession}
                  disabled={isLoading}
                  aria-label="Pause session"
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth
                  startIcon={<PlayArrowIcon />}
                  onClick={handleResumeSession}
                  disabled={isLoading}
                  aria-label="Resume session"
                >
                  Resume
                </Button>
              )}

              <Button
                variant="contained"
                color="error"
                size="small"
                fullWidth
                startIcon={<StopIcon />}
                onClick={handleStopSession}
                disabled={isLoading}
                aria-label="Stop session and save data"
              >
                Stop
              </Button>
            </>
          )}
        </Stack>

        {isLoading && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, textAlign: 'center' }}
            role="status"
            aria-live="polite"
          >
            Saving...
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} ViDScribe
        </Box>
      </Box>
    </Box>
  );

  const container = windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="Main navigation"
    >
      {/* Mobile menu button */}
      <IconButton
        color="inherit"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          ml: 2, 
          mt: 2,
          display: { sm: 'none' },
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'action.hover',
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        id="mobile-drawer"
        ModalProps={{
          keepMounted: true,
          'aria-hidden': !mobileOpen,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            boxShadow: 3
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 1,
            borderColor: 'divider'
          },
        }}
        open
        aria-label="Main navigation"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default ResponsiveDrawer;