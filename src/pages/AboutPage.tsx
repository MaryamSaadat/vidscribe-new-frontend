import React from 'react';
import AboutCard from '../components/AboutCard';
import SideNav from '../components/SideNav';
import { aboutWebsite, people } from '../utils/constants';
import {
    Box,
    Typography,
    Stack,
    Container,
    Paper,
    Divider,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import {
    Info as InfoIcon,
    People as PeopleIcon,
    EmojiEvents as SponsorIcon,
    VolunteerActivism as ContributorIcon 
} from '@mui/icons-material';
import type { Person, contributors } from '../utils/constants';

// Mock contributors data - replace with actual data source
const contributors = [
    'Sejal Jain', 'Nimeesh Milind Mahajan', 'Kerry Zhuo', 'Anuj Nathan Kamasamudram',
    'Saanvi Agrawal', 'Adam Colyar', 'Yasmine Muraweh', 'Asish Panda',
    'Andrew Mitchell'
];

const AboutPage: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <SideNav />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        py: { xs: 3, md: 5 },
                        px: { xs: 2, md: 4 }
                    }}
                >
                    {/* Mission Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            mb: 5,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: 'background.paper',
                        }}
                        component="section"
                        aria-labelledby="mission-heading"
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                color: 'primary.main',
                            }}
                        >
                            About ViDScribe
                        </Typography>
                        <Stack spacing={3}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    lineHeight: 1.8,
                                }}
                            >
                                {aboutWebsite[0]}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    lineHeight: 1.8,
                                }}
                            >
                                {aboutWebsite[1]}
                            </Typography>
                        </Stack>
                    </Paper>

                    {/* Team Section */}
                    <Box
                        component="section"
                        aria-labelledby="team-heading"
                        sx={{ mb: 5 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2
                            }}
                        >
                            <PeopleIcon
                                sx={{
                                    fontSize: 40,
                                    color: 'primary.main'
                                }}
                                aria-hidden="true"
                            />
                            <Typography
                                variant="h3"
                            >
                                Our Team
                            </Typography>
                        </Box>

                        <Divider
                            sx={{
                                mb: 4,
                                bgcolor: 'primary.main',
                                height: 2,
                                width: '80px',
                            }}
                        />

                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            gap={3}
                            role="list"
                            aria-label="Team members"
                        >
                            {people.map((item: Person, idx: number) => (
                                <Box
                                    key={idx}
                                    role="listitem"
                                    sx={{
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                        }
                                    }}
                                >
                                    <AboutCard
                                        image={item.image}
                                        name={item.name}
                                        info={item.info}
                                        email={item.email}
                                        site={item.site}
                                        zoom={item.zoom}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* Contributors Section */}
                    <Box
                        component="section"
                        aria-labelledby="contributors-heading"
                        sx={{ mb: 5 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2
                            }}
                        >
                            <ContributorIcon
                                sx={{
                                    fontSize: 40,
                                    color: 'primary.main'
                                }}
                                aria-hidden="true"
                            />
                            <Typography
                                variant="h3"
                            >
                                Contributors
                            </Typography>
                        </Box>

                        <Divider
                            sx={{
                                mb: 4,
                                bgcolor: 'primary.main',
                                height: 2,
                                width: '80px',
                            }}
                        />

                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 5 },
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                }}
                            >
                                Thank you to all our amazing contributors who used ViDScribe to create accessible video descriptions!
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1.5
                                }}
                                role="list"
                                aria-label="List of contributors"
                            >
                                {contributors.map((name, idx) => (
                                    <Box
                                        key={idx}
                                        role="listitem"
                                        component="span"
                                        sx={{
                                            display: 'inline-block',
                                            px: 2.5,
                                            py: 1,
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            border: `1px solid ${theme.palette.divider}`,
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            transition: 'all 0.2s ease',
                                            cursor: 'default',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                borderColor: 'primary.main',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                            },
                                        }}
                                        aria-label={`Contributor: ${name}`}
                                    >
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: '0.9rem',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Sponsor Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 3,
                            border: `0.5px solid ${alpha(theme.palette.primary.dark, 0.2)}`,
                            bgcolor: theme.palette.primary.light,
                            textAlign: 'center',
                        }}
                        component="section"
                        aria-labelledby="sponsor-heading"
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                mb: 2
                            }}
                        >
                            <SponsorIcon
                                sx={{
                                    fontSize: 40,
                                    color: 'primary.main'
                                }}
                                aria-hidden="true"
                            />
                            <Typography
                                variant="h3"
                            >
                                Our Sponsor
                            </Typography>
                        </Box>

                        <Divider
                            sx={{
                                mb: 4,
                                bgcolor: 'primary.main',
                                height: 2,
                                width: '80px',
                                mx: 'auto',
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 4,
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <img
                                src="https://www.nei.nih.gov/themes/custom/nei/images/NEI-logo-tagline.svg"
                                alt="National Eye Institute, National Institutes of Health logo"
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    height: 'auto',
                                }}
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 3,
                                fontSize: '0.95rem',
                                fontStyle: 'italic',
                            }}
                        >
                            Proudly supported by the National Eye Institute
                        </Typography>
                    </Paper>

                    {/* Footer Spacing */}
                    <Box sx={{ pb: 4 }} />
                </Container>
            </Box>
        </Box>
    );
};

export default AboutPage;