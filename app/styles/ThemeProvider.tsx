import CssBaseline from '@mui/material/CssBaseline';
import type { Theme } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import CssVariables from './CssVariables';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: Theme;
}

export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssVariables theme={theme} />
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
