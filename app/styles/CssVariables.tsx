import type { Theme } from '@mui/material';
import { GlobalStyles } from '@mui/material';
import * as React from 'react';

interface CssVariablesProps {
  theme: Theme;
}

const CssVariables = React.memo(function CssVariables({
  theme,
}: CssVariablesProps) {
  return (
    <GlobalStyles
      styles={{
        ':root': {
          '--mui-grid-size': theme.spacing(1),
          '--mui-palette-background-paper': theme.palette.background.paper,
          '--mui-palette-divider': theme.palette.divider,
          '--mui-palette-error-main': theme.palette.error.main,
          '--mui-palette-primary-faint': `${theme.palette.primary.main}1f`, // 12% opacity
          '--mui-palette-primary-main': theme.palette.primary.main,
          '--mui-palette-success-main': theme.palette.success.main,
          '--mui-palette-text-primary': theme.palette.text.primary,
          '--mui-palette-text-secondary': theme.palette.text.secondary,
          '--mui-shape-borderRadius': `${theme.shape.borderRadius}px`,
        },
      }}
    />
  );
});

export default CssVariables;
