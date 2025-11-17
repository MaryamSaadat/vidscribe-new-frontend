import React from 'react';
// import { AboutCard, Navbar, SideNav, StyledHeading } from '../components';
import AboutCard from '../components/AboutCard';
import SideNav from '../components/SideNav';
import { aboutWebsite, people } from '../utils/constants';
import { Box, Typography, Stack } from '@mui/material';
import type { Person } from '../utils/constants';

const AboutPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <SideNav />
            <Box
                component="main"
                m={2}
                sx={{ flexGrow: 1 }}
            >
                <Typography variant="h1" gutterBottom>About ViDScribe</Typography>
                {/* <StyledHeading text="About ViDScribe" /> */}
                <Typography width="70%">{aboutWebsite[0]}</Typography>
                <br />
                <Typography width="70%">{aboutWebsite[1]}</Typography>
                <br />
                <Typography variant="h1" gutterBottom>People</Typography>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="start"
                    alignItems="start"
                    columnGap={2}
                    m={2}
                    mb={4}
                >
                    {people.map((item: Person, idx: number) => (
                        <AboutCard
                            key={idx}
                            image={item.image}
                            name={item.name}
                            info={item.info}
                            email={item.email}
                            site={item.site}
                            zoom={item.zoom}
                        />
                    ))}
                </Stack>
                {/* <StyledHeading text="Sponsors" /> */}
                <Typography variant="h1">Sponsor</Typography>
                <Box m={3}>
                    <img
                        src="https://www.nei.nih.gov/themes/custom/nei/images/NEI-logo-tagline.svg"
                        alt="National Institute of Health Logo"
                        width="30%"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default AboutPage;