import React, { useState, useEffect } from 'react';
import { Stack,  Button, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Navbar: React.FC = () => {
    const [session, setSession] = useState<any | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { signOut } = useAuthenticator();

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

    return (
        <Stack
            direction="row"
            alignItems="center"
            p={2}
            sx={{
                top: 0,
                justifyContent: 'space-between',
            }}
        >
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Described Videos"
                    inputProps={{ 'aria-label': 'Search Described Videos' }}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            <Button
                variant="contained"
                onClick={isLoggedIn ? () => signOut() : undefined}
                aria-label={isLoggedIn ? "Log out of your account" : "Log in to your account, you are currently not signed in"}
            >
                {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </Button>
        </Stack>
    );
};

export default Navbar;