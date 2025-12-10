import React, { useState, useEffect } from 'react';
import { 
    Stack, 
    Button, 
    IconButton, 
    Paper, 
    InputBase, 
    Box,
    Avatar,
    Tooltip,
    Badge,
    useTheme,
    alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Navbar: React.FC = () => {
    const theme = useTheme();
    const [session, setSession] = useState<any | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { signOut, user } = useAuthenticator();

    useEffect(() => {
        let mounted = true;
        async function loadSession() {
            try {
                const s = await fetchAuthSession();
                if (!mounted) return;
                setSession(s);
                setIsLoggedIn(Boolean(s?.tokens?.idToken));
            } catch (err) {
                console.error('Failed to fetch session', err);
            }
        }
        loadSession();
        return () => {
            mounted = false;
        };
    }, []);

    // Get user initials for avatar
    const getUserInitials = (): string => {
        if (!user) return 'U';
        const name = user.signInDetails.loginId || 'User';
        return name.charAt(0).toUpperCase();
    };

    return (
        <Box
            component="nav"
            role="navigation"
            aria-label="Main navigation"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                bgcolor: 'background.paper',
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                    px: { xs: 2, md: 4 },
                    py: 1.5,
                    justifyContent: 'space-between',
                }}
            >
                {/* Search Bar */}
                <Paper
                    component="form"
                    elevation={0}
                    onSubmit={(e) => e.preventDefault()}
                    sx={{
                        p: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        width: { xs: '100%', sm: 400 },
                        maxWidth: 500,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        '&:focus-within': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
                        },
                    }}
                    role="search"
                >
                    <IconButton
                        type="submit"
                        sx={{ p: 1, color: 'text.secondary' }}
                        aria-label="Search for described videos"
                    >
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ 
                            ml: 1, 
                            flex: 1,
                            fontSize: '0.95rem',
                        }}
                        placeholder="Search described videos..."
                        inputProps={{ 
                            'aria-label': 'Search described videos',
                        }}
                    />
                </Paper>

                {/* User Actions */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    {isLoggedIn ? (
                        <>
                            {/* User Avatar */}
                            <Tooltip title={user?.signInDetails.loginId || 'User profile'}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#44b700',
                                            color: '#44b700',
                                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                                            '&::after': {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                animation: 'ripple 1.2s infinite ease-in-out',
                                                border: '1px solid currentColor',
                                                content: '""',
                                            },
                                        },
                                        '@keyframes ripple': {
                                            '0%': {
                                                transform: 'scale(.8)',
                                                opacity: 1,
                                            },
                                            '100%': {
                                                transform: 'scale(2.4)',
                                                opacity: 0,
                                            },
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: 'primary.main',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: 2,
                                            },
                                        }}
                                        aria-label={`Logged in as ${user?.username || 'user'}`}
                                    >
                                        {getUserInitials()}
                                    </Avatar>
                                </Badge>
                            </Tooltip>

                            {/* Sign Out Button */}
                            <Tooltip title="Sign out of your account">
                                <Button
                                    variant="outlined"
                                    onClick={() => signOut()}
                                    startIcon={<LogoutIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'error.main',
                                            color: 'error.main',
                                            bgcolor: alpha(theme.palette.error.main, 0.08),
                                        },
                                    }}
                                    aria-label="Sign out of your account"
                                >
                                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                        Sign Out
                                    </Box>
                                </Button>
                            </Tooltip>
                        </>
                    ) : (
                        <Tooltip title="Sign in to access all features">
                            <Button
                                variant="contained"
                                startIcon={<LoginIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 3,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 2,
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                                aria-label="Sign in to your account"
                            >
                                Sign In
                            </Button>
                        </Tooltip>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};

export default Navbar;
