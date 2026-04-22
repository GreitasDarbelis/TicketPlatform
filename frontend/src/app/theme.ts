import { createTheme } from '@mui/material/styles';

const figmaPalette = {
  inkBlack: '#061E23',
  stormyTeal: '#336970',
  darkCyan: '#24948E',
  lightCyan: '#DAF9FB',
  pumpkinSpice: '#F27618',
  black: '#000000',
  white: '#FFFFFF',
  brightFern: '#35B109',
  brickEmber: '#CF0000',
  schoolBusYellow: '#FFC800',
} as const;

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: figmaPalette.darkCyan,
      dark: figmaPalette.stormyTeal,
      light: figmaPalette.lightCyan,
      contrastText: figmaPalette.white,
    },
    secondary: {
      main: figmaPalette.pumpkinSpice,
      contrastText: figmaPalette.white,
    },
    success: {
      main: figmaPalette.brightFern,
      contrastText: figmaPalette.white,
    },
    error: {
      main: figmaPalette.brickEmber,
      contrastText: figmaPalette.white,
    },
    warning: {
      main: figmaPalette.schoolBusYellow,
      contrastText: figmaPalette.black,
    },
    background: {
      default: figmaPalette.lightCyan,
      paper: figmaPalette.white,
    },
    text: {
      primary: figmaPalette.black,
      secondary: figmaPalette.inkBlack,
      disabled: figmaPalette.stormyTeal,
    },
    divider: figmaPalette.lightCyan,
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 500,
    h3: {
      fontWeight: 500,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: figmaPalette.lightCyan,
          color: figmaPalette.black,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: figmaPalette.inkBlack,
          color: figmaPalette.white,
          boxShadow: 'none',
        },
        colorPrimary: {
          backgroundImage: 'none',
          backgroundColor: figmaPalette.inkBlack,
          color: figmaPalette.white,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: figmaPalette.white,
          color: figmaPalette.black,
          borderRadius: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: figmaPalette.white,
          color: figmaPalette.black,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
});
