import type { PaletteMode } from '@mui/material';
import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

function getPalette(mode: PaletteMode): ThemeOptions['palette'] {
  return {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#635dff',
          },
        }
      : {
          primary: {
            main: '#7c87da',
          },
          background: {
            default: '#22272e',
            paper: '#2d333b',
          },
          text: {
            secondary: '#768390',
          },
        }),
  };
}

const typography: ThemeOptions['typography'] = {
  fontFamily: [
    '"Inter"',
    '"Roboto"',
    '"Helvetica"',
    '"Arial"',
    'sans-serif',
  ].join(','),
  button: {
    textTransform: 'none',
  },
} as const;

function getComponents(mode: PaletteMode): ThemeOptions['components'] {
  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormHelperText-root': {
            display: 'flex',
            flexDirection: 'column',
          },
        },
      },
    },
    ...(mode === 'light'
      ? {
          MuiAlert: {
            styleOverrides: {
              root: ({ ownerState }) => ({
                border: '1px solid',
                ...(ownerState.severity === 'info'
                  ? {
                      backgroundColor: '#ddf4ff',
                      borderColor: '#54aeff66',
                    }
                  : ownerState.severity === 'success'
                  ? {
                      backgroundColor: '#dafbe1',
                      borderColor: '#4ac26b66',
                    }
                  : ownerState.severity === 'warning'
                  ? {
                      backgroundColor: '#fff8c5',
                      borderColor: '#d4a72c66',
                    }
                  : ownerState.severity === 'error'
                  ? {
                      backgroundColor: '#ffebe9',
                      borderColor: '#ff818266',
                    }
                  : {}),
              }),
            },
          },
        }
      : {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#1c2128',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: ({ ownerState }) => ({
                ...(ownerState.variant === 'contained' &&
                  ownerState.color === 'primary' && {
                    backgroundColor: '#5e6ad2',
                    '&:hover': {
                      backgroundColor: '#414992',
                    },
                    color: '#fff',
                  }),
              }),
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: ({ ownerState }) => ({
                border: '1px solid',
                ...(ownerState.severity === 'info'
                  ? {
                      backgroundColor: '#4184e426',
                      borderColor: '#4184e466',
                    }
                  : ownerState.severity === 'success'
                  ? {
                      backgroundColor: '#46954a26',
                      borderColor: '#46954a66',
                    }
                  : ownerState.severity === 'warning'
                  ? {
                      backgroundColor: '#ae7c1426',
                      borderColor: '#ae7c1466',
                    }
                  : ownerState.severity === 'error'
                  ? {
                      backgroundColor: '#e5534b26',
                      borderColor: '#e5534b66',
                    }
                  : {}),
              }),
            },
          },
        }),
  };
}

export default function getTheme(mode: PaletteMode) {
  return createTheme({
    palette: getPalette(mode),
    typography,
    components: getComponents(mode),
  });
}
