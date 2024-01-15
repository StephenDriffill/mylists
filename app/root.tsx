import { withEmotionCache } from '@emotion/react';
import type { Theme } from '@mui/material';
import { cssBundleHref } from '@remix-run/css-bundle';
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import * as React from 'react';
import { z } from 'zod';

import { GeneralErrorBoundary, Page, Toaster } from '~/components';
import usePaletteMode from '~/hooks/usePaletteMode';
import {
  createPreferencesHeaders,
  getPaletteMode,
} from '~/models/preferences.server';
import type { Toast } from '~/models/toast.server';
import { getToast } from '~/models/toast.server';
import { getOptionalUser } from '~/session.server';
import {
  ClientStyleContext,
  ServerStyleContext,
  ThemeProvider,
  fontsourceInter,
  getTheme,
  globalStyles,
} from '~/styles';

import { getBem } from './utils/bem';
import { intentSchema, invariantIntent } from './utils/validation';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  ...fontsourceInter,
  ...(cssBundleHref !== undefined && cssBundleHref !== ''
    ? [{ rel: 'stylesheet', href: cssBundleHref }]
    : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser(request);
  const { headers, toast } = await getToast(request);
  const paletteMode = await getPaletteMode(request);

  return json({ paletteMode, toast, user }, { headers });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // validate intent
  const IntentSchema = intentSchema(['setPaletteMode']);
  const intentResult = await withZod(IntentSchema).validate(formData);
  invariantIntent(intentResult);

  // switch palette mode
  const PaletteModeSchema = z.object({
    paletteMode: z.enum(['light', 'dark']),
    redirectTo: z.string(),
  });
  const paletteModeResult = await withZod(PaletteModeSchema).validate(formData);

  if (paletteModeResult.error !== undefined) {
    return json({ success: false }, { status: 400 });
  }

  const headers = await createPreferencesHeaders(request, {
    paletteMode: paletteModeResult.data.paletteMode,
  });
  return redirect(paletteModeResult.data.redirectTo, { headers });
}

interface DocumentProps {
  children: React.ReactNode;
  theme: Theme;
  toast?: Toast | null;
}

const Document = withEmotionCache(
  ({ children, theme, toast }: DocumentProps, emotionCache) => {
    const bem = getBem('Document');
    const serverStyleData = React.useContext(ServerStyleContext);
    const clientStyleData = React.useContext(ClientStyleContext);
    const reinjectStylesRef = React.useRef(true);

    // when top-level ErrorBoundary is rendered,
    // the document head gets removed, so we have to create the style tags
    React.useEffect(() => {
      if (!reinjectStylesRef.current) {
        return;
      }
      // re-link sheet container
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
      // ensure we only do this once per mount
      reinjectStylesRef.current = false;
    }, [clientStyleData, emotionCache.sheet]);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width,initial-scale=1" name="viewport" />
          <Meta />
          <Links />
          {serverStyleData?.map(({ css, ids, key }) => (
            <style
              dangerouslySetInnerHTML={{ __html: css }}
              data-emotion={`${key} ${ids.join(' ')}`}
              key={key}
            />
          ))}
        </head>
        <body
          className={bem(
            'Document__body',
            `Document__body--${theme.palette.mode}`,
          )}
        >
          <Toaster toast={toast ?? null} />
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  },
);

export default function App() {
  const { toast } = useLoaderData<typeof loader>();
  const paletteMode = usePaletteMode();
  const theme = React.useMemo(() => getTheme(paletteMode), [paletteMode]);

  return (
    <Document theme={theme} toast={toast}>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const theme = React.useMemo(() => getTheme('light'), []);

  return (
    <Document theme={theme}>
      <Page header={false}>
        <GeneralErrorBoundary />
      </Page>
    </Document>
  );
}
