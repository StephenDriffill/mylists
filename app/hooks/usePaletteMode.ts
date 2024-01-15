import type { PaletteMode } from '@mui/material';

import { useMatchesData } from '~/utils';

export default function usePaletteMode(): PaletteMode {
  const rootData = useMatchesData('root');
  const paletteMode = rootData?.paletteMode;
  return paletteMode === 'dark' ? 'dark' : 'light';
}
