import { createTheme } from '@mui/material/styles';
const baseTheme = createTheme();

export const theme = createTheme({
  palette: {
    primary: {
      light: '#FFFFFF',
      main: '#8C1D40',
      dark: '#000000',
    },
    secondary: {
      main: '#FFC627',
      light: '#EF6262',
      contrastText: 'white',
    },
  },
  typography: {
    fontFamily: ['Arial'].join(','),
    h1: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '3=2rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2.5rem',
      },
      backgroundColor: '#FFC627',
      fontWeight: 'bold',
      padding: '0.1em 0.25em',
      width: 'auto',
    },
    h3: {
      fontSize: '1.2rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2.4rem',
      },
    },

  },
});
