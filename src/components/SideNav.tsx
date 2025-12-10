// import * as React from 'react';
// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import Drawer from '@mui/material/Drawer';
// import IconButton from '@mui/material/IconButton';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import HomeIcon from '@mui/icons-material/Home';
// import UploadIcon from '@mui/icons-material/Upload';
// import LinkIcon from '@mui/icons-material/Link';
// import { categories } from '../utils/constants';
// import { Link, useLocation } from 'react-router-dom';
// import logo from '../utils/Logo.png';
// import type { Category } from '../utils/constants';

// const drawerWidth = 240;

// interface ResponsiveDrawerProps {
//   window?: () => Window;
//   selectedCategory?: string;
//   setSelectedCategory?: (category: string) => void;
// }

// // Icon mapping for categories
// const categoryIcons: Record<string, React.ReactElement> = {
//   'Home': <HomeIcon />,
//   'Upload Video': <UploadIcon />,
//   'Youtube Video': <LinkIcon />,
// };

// const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ 
//   window: windowProp,
//   selectedCategory,
//   setSelectedCategory 
// }) => {
//   const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
//   const [isClosing, setIsClosing] = React.useState<boolean>(false);
//   const location = useLocation();

//   const handleDrawerClose = (): void => {
//     setIsClosing(true);
//     setMobileOpen(false);
//   };

//   const handleDrawerTransitionEnd = (): void => {
//     setIsClosing(false);
//   };

//   const handleDrawerToggle = (): void => {
//     if (!isClosing) {
//       setMobileOpen(!mobileOpen);
//     }
//   };

//   const drawer = (
//     <Box 
//       sx={{ 
//         height: '100%', 
//         display: 'flex', 
//         flexDirection: 'column',
//         bgcolor: 'background.paper'
//       }}
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       {/* Logo Header */}
//       <Box 
//         sx={{ 
//           p: 3,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           minHeight: 80
//         }}
//       >
//         <Link 
//           to="/" 
//           style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }}
//           aria-label="ViDScribe home"
//         >
//           <img 
//             src={logo} 
//             alt="ViDScribe Logo" 
//             style={{ 
//               maxWidth: '100%', 
//               height: 'auto',
//               maxHeight: '50px'
//             }} 
//           />
//         </Link>
//         {/* Close button for mobile */}
//         <IconButton
//           onClick={handleDrawerClose}
//           sx={{ display: { sm: 'none' } }}
//           aria-label="Close navigation menu"
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
      
//       <Divider />
      
//       {/* Navigation List */}
//       <List 
//         component="nav" 
//         sx={{ flex: 1, pt: 2 }}
//         aria-label="Navigation menu"
//       >
//         {categories.map((category: Category, idx: number) => {
//           const isActive = location.pathname === category.href;
          
//           return (
//             <ListItem 
//               key={category.name} 
//               disablePadding
//               sx={{ mb: 0.5 }}
//             >
//               <ListItemButton
//                 component={Link}
//                 to={category.href}
//                 selected={isActive}
//                 onClick={() => {
//                   if (setSelectedCategory) {
//                     setSelectedCategory(category.name);
//                   }
//                   if (mobileOpen) {
//                     handleDrawerClose();
//                   }
//                 }}
//                 sx={{
//                   mx: 1,
//                   borderRadius: 2,
//                   '&.Mui-selected': {
//                     bgcolor: 'primary.main',
//                     color: 'primary.contrastText',
//                     '&:hover': {
//                       bgcolor: 'primary.dark',
//                     },
//                     '& .MuiListItemIcon-root': {
//                       color: 'primary.contrastText',
//                     }
//                   },
//                   '&:hover': {
//                     bgcolor: 'action.hover',
//                   },
//                   transition: 'all 0.2s ease-in-out',
//                 }}
//                 aria-label={`Navigate to ${category.name}`}
//                 aria-current={isActive ? 'page' : undefined}
//               >
//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   {categoryIcons[category.name] || <HomeIcon />}
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary={category.name}
//                 />
//               </ListItemButton>
//             </ListItem>
//           );
//         })}
//       </List>

//       {/* Footer */}
//       <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
//         <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem' }}>
//           © {new Date().getFullYear()} ViDScribe
//         </Box>
//       </Box>
//     </Box>
//   );

//   const container = windowProp !== undefined ? () => windowProp().document.body : undefined;

//   return (
//     <Box
//       component="nav"
//       sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       aria-label="Main navigation"
//     >
//       {/* Mobile menu button */}
//       <IconButton
//         color="inherit"
//         aria-label="Open navigation menu"
//         aria-expanded={mobileOpen}
//         aria-controls="mobile-drawer"
//         edge="start"
//         onClick={handleDrawerToggle}
//         sx={{ 
//           ml: 2, 
//           mt: 2,
//           display: { sm: 'none' },
//           position: 'fixed',
//           zIndex: (theme) => theme.zIndex.drawer + 2,
//           bgcolor: 'background.paper',
//           boxShadow: 2,
//           '&:hover': {
//             bgcolor: 'action.hover',
//           }
//         }}
//       >
//         <MenuIcon />
//       </IconButton>

//       {/* Mobile drawer */}
//       <Drawer
//         container={container}
//         variant="temporary"
//         open={mobileOpen}
//         onTransitionEnd={handleDrawerTransitionEnd}
//         onClose={handleDrawerClose}
//         id="mobile-drawer"
//         ModalProps={{
//           keepMounted: true,
//           'aria-hidden': !mobileOpen,
//         }}
//         sx={{
//           display: { xs: 'block', sm: 'none' },
//           '& .MuiDrawer-paper': { 
//             boxSizing: 'border-box', 
//             width: drawerWidth,
//             boxShadow: 3
//           },
//         }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Desktop drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: 'none', sm: 'block' },
//           '& .MuiDrawer-paper': { 
//             boxSizing: 'border-box', 
//             width: drawerWidth,
//             borderRight: 1,
//             borderColor: 'divider'
//           },
//         }}
//         open
//         aria-label="Main navigation"
//       >
//         {drawer}
//       </Drawer>
//     </Box>
//   );
// };

// export default ResponsiveDrawer;


// src/components/ResponsiveDrawer.tsx
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

interface SessionEvent {
  type: 'start' | 'pause' | 'resume' | 'stop';
  time: string; // ISO
}

interface SessionData {
  sessionId: string;
  startTime: string;                // when the session was originally started (ISO)
  lastStartTime?: string | null;    // when it was last started/resumed (ISO) — null if paused/stopped
  accumulatedSeconds: number;       // total seconds counted from previous active periods
  events: SessionEvent[];
  status: 'active' | 'paused' | 'stopped';
  totalDuration?: number;           // filled on stop
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

  // Session & timer state
  const [sessionData, setSessionData] = React.useState<SessionData | null>(null);
  const [currentTime, setCurrentTime] = React.useState<number>(0); // seconds
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const timerRef = React.useRef<number | null>(null);
  const announcementRef = React.useRef<HTMLDivElement>(null);

  const location = useLocation();

  // Get authenticated user
  const { user } = useAuthenticator();
  const username = (user as any)?.signInDetails?.loginId || (user as any)?.username || 'unknown_user';

  // Screen reader announcement function
  const announceToScreenReader = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  // ------------ Persist / Save to backend ------------
  const saveSessionToDatabase = async (session: SessionData) => {
    setIsLoading(true);
    try {
      const sessionWithUser = {
        ...session,
        username,
      };

      const response = await fetch(
        `${import.meta.env.VITE_LOG_SESSION_API}`,
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

  // ---------- Local persistence helper ----------
  const persistLocal = (session: SessionData) => {
    try {
      localStorage.setItem('userSession', JSON.stringify(session));
    } catch (e) {
      console.warn('Could not persist session locally', e);
    }
  };

  // ---------- Load session from localStorage on mount ----------
  React.useEffect(() => {
    const saved = localStorage.getItem('userSession');
    if (!saved) return;
    try {
      const parsed: SessionData = JSON.parse(saved);

      const now = Date.now();
      let elapsed = parsed.accumulatedSeconds || 0;
      if (parsed.lastStartTime && parsed.status === 'active') {
        elapsed += Math.floor((now - new Date(parsed.lastStartTime).getTime()) / 1000);
      }

      setSessionData(parsed);
      setCurrentTime(elapsed);
    } catch (err) {
      console.error('Failed to parse saved session:', err);
      localStorage.removeItem('userSession');
    }
  }, []);

  // ---------- Timer effect: tick only when active ----------
  React.useEffect(() => {
    if (sessionData?.status === 'active') {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000) as unknown as number;
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionData?.status]);

  // ---------- Utility: formatTime ----------
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---------- Handlers: start / pause / resume / stop ----------
  const handleStartSession = async () => {
    const nowIso = new Date().toISOString();
    const newSession: SessionData = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      startTime: nowIso,
      lastStartTime: nowIso,
      accumulatedSeconds: 0,
      events: [{ type: 'start', time: nowIso }],
      status: 'active',
    };

    setSessionData(newSession);
    setCurrentTime(0);
    persistLocal(newSession);
    announceToScreenReader('Session started successfully. Timer is now running.');

    try {
      await saveSessionToDatabase(newSession);
    } catch (err) {
      console.error('Error saving session start:', err);
    }
  };

  const handlePauseSession = async () => {
    if (!sessionData || sessionData.status !== 'active' || !sessionData.lastStartTime) return;

    const now = Date.now();
    const lastStartMs = new Date(sessionData.lastStartTime).getTime();
    const secondsThisRun = Math.floor((now - lastStartMs) / 1000);

    const updated: SessionData = {
      ...sessionData,
      accumulatedSeconds: (sessionData.accumulatedSeconds || 0) + secondsThisRun,
      lastStartTime: null,
      events: [...sessionData.events, { type: 'pause', time: new Date().toISOString() }],
      status: 'paused',
    };

    setSessionData(updated);
    setCurrentTime(updated.accumulatedSeconds);
    persistLocal(updated);
    announceToScreenReader(`Session paused at ${formatTime(updated.accumulatedSeconds)}.`);

    try {
      await saveSessionToDatabase(updated);
    } catch (err) {
      console.error('Error saving session pause:', err);
    }
  };

  const handleResumeSession = async () => {
    if (!sessionData || sessionData.status !== 'paused') return;

    const nowIso = new Date().toISOString();
    const updated: SessionData = {
      ...sessionData,
      lastStartTime: nowIso,
      events: [...sessionData.events, { type: 'resume', time: nowIso }],
      status: 'active',
    };

    setSessionData(updated);
    setCurrentTime(updated.accumulatedSeconds);
    persistLocal(updated);
    announceToScreenReader('Session resumed. Timer is now running.');

    try {
      await saveSessionToDatabase(updated);
    } catch (err) {
      console.error('Error saving session resume:', err);
    }
  };

  const handleStopSession = async () => {
    if (!sessionData) return;

    const now = Date.now();
    let finalSeconds = sessionData.accumulatedSeconds || 0;

    if (sessionData.lastStartTime && sessionData.status === 'active') {
      finalSeconds += Math.floor((now - new Date(sessionData.lastStartTime).getTime()) / 1000);
    }

    const updated: SessionData = {
      ...sessionData,
      lastStartTime: null,
      accumulatedSeconds: finalSeconds,
      totalDuration: finalSeconds,
      events: [...sessionData.events, { type: 'stop', time: new Date().toISOString() }],
      status: 'stopped',
    };

    setSessionData(updated);
    setCurrentTime(finalSeconds);
    persistLocal(updated);
    announceToScreenReader(
      `Session stopped. Total duration: ${formatTime(finalSeconds)}. Session data saved.`
    );

    try {
      await saveSessionToDatabase(updated);
      // Clear local state after short delay so user hears the announcement
      setTimeout(() => {
        localStorage.removeItem('userSession');
        setSessionData(null);
        setCurrentTime(0);
        announceToScreenReader('Session cleared. You can start a new session.');
      }, 1000);
    } catch (err) {
      console.error('Error saving session stop:', err);
    }
  };

  // ---------- Drawer controls ----------
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

  // ---------- Drawer content ----------
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
        {categories.map((category: Category) => {
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
