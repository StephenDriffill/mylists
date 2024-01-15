import { Box, Typography } from '@mui/material';
import { Link } from '@remix-run/react';

import { getBem } from '~/utils/bem';

import './Logo.css';

interface LogoProps {
  iconDisplay?: 'inline' | 'block' | false;
}

export default function Logo({ iconDisplay = 'inline' }: LogoProps) {
  const bem = getBem('Logo');
  return (
    <Box
      className={bem(
        'Logo',
        typeof iconDisplay === 'string' ? `Logo--${iconDisplay}` : null,
      )}
      component={Link}
      to="/"
    >
      <Box className={bem('Logo__textWrapper')}>
        <Typography
          className={bem('Logo__text', 'Logo__textLeft')}
          variant="h5"
        >
          MY
        </Typography>
        <Typography className={bem('Logo__text')} variant="h5">
          LISTS
        </Typography>
      </Box>
    </Box>
  );
}
