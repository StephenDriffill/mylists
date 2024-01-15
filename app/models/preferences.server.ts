import type { PaletteMode } from '@mui/material';

import { createCookieSessionStorage } from '~/utils/cookies';

const PALETTE_MODE_KEY = 'paletteMode';

const preferencesSessionStorage = createCookieSessionStorage('preferences');

interface Preferences {
  paletteMode?: PaletteMode;
}

function isPaletteMode(paletteMode: unknown): paletteMode is PaletteMode {
  if (typeof paletteMode !== 'string') {
    return false;
  }
  return ['light', 'dark'].includes(paletteMode);
}

export async function getPaletteMode(request: Request): Promise<PaletteMode> {
  const session = await preferencesSessionStorage.getSession(
    request.headers.get('cookie'),
  );
  const paletteMode = session.get(PALETTE_MODE_KEY);

  if (isPaletteMode(paletteMode)) {
    return paletteMode;
  }

  return 'light';
}

export async function createPreferencesHeaders(
  request: Request,
  { paletteMode }: Preferences,
) {
  const session = await preferencesSessionStorage.getSession(
    request.headers.get('cookie'),
  );
  if (isPaletteMode(paletteMode)) {
    session.set(PALETTE_MODE_KEY, paletteMode);
  }
  const cookie = await preferencesSessionStorage.commitSession(session);
  return new Headers({ 'set-cookie': cookie });
}
