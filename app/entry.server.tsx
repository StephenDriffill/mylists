import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import type {
  AppLoadContext,
  DataFunctionArgs,
  EntryContext,
} from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';

import createEmotionCache from '~/styles/createEmotionCache';
import ServerStyleContext from '~/styles/ServerStyleContext';

import { logError } from './models/errorLog.server';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  );

  const chunks = extractCriticalToChunks(html);

  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export function handleError(error: unknown, { request }: DataFunctionArgs) {
  if (!request.signal.aborted) {
    logError(error, request);
    console.error(error);
  }
}
