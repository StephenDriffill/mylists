import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import { NavLink, useLocation, useSubmit } from '@remix-run/react';

import { Logo } from '~/components';
import usePaletteMode from '~/hooks/usePaletteMode';
import type { User } from '~/models/user.server';
import { getBem } from '~/utils/bem';
import { INTENT_ENTRY_KEY } from '~/utils/validation';

import './Header.css';

type NavigationLink = {
  label: string;
  to: string;
};

interface HeaderProps {
  user: User | undefined;
}

export default function Header({ user }: HeaderProps) {
  const bem = getBem('Header');
  const submit = useSubmit();
  const links: NavigationLink[] = [];
  const paletteMode = usePaletteMode();
  const location = useLocation();

  const handleTogglePaletteMode = () => {
    const formData = new FormData();
    formData.append(INTENT_ENTRY_KEY, 'setPaletteMode');
    formData.append('paletteMode', paletteMode === 'light' ? 'dark' : 'light');
    formData.append('redirectTo', `${location.pathname}${location.search}`);
    submit(formData, { action: '/', method: 'post' });
  };

  return (
    <Box className={bem('Header')} component="header">
      <Box className={bem('Header__appBarContainer')}>
        <AppBar
          className={bem('Header__appBar')}
          color="transparent"
          component={Box}
          elevation={0}
          position="static"
        >
          <Toolbar>
            <Box className={bem('Header__logoContainer')}>
              <Logo />
            </Box>
            <Box className={bem('Header__links')}>
              {user !== undefined
                ? links.map(({ label, to }) => (
                    <Button component={NavLink} key={to} to={to}>
                      {label}
                    </Button>
                  ))
                : null}
            </Box>
            <IconButton onClick={handleTogglePaletteMode}>
              {paletteMode === 'light' ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
}
