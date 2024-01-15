import { Box, Button, Typography } from '@mui/material';
import {
  Link,
  isRouteErrorResponse,
  useNavigate,
  useParams,
  useRouteError,
} from '@remix-run/react';


import { getErrorMessage } from '~/utils/route';

import './GeneralErrorBoundary.css';

type StatusHandler = (info: {
  error: {
    message?: string;
    stack?: string;
    status: string | undefined;
  };
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

function GeneralErrorBoundary({
  statusHandlers,
}: {
  statusHandlers?: Record<string, StatusHandler>;
}) {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);
  const params = useParams();
  const status = isRouteError
    ? `${error.status} ${error.statusText}`
    : undefined;
  const message = isRouteError
    ? error.data
    : error instanceof Error
    ? error.message
    : 'An unknown error occurred.';
  const defaultStatusHandler: StatusHandler = ({ error }) => (
    <>
      <GeneralErrorBoundary.Title text="Something went wrong" />
      <GeneralErrorBoundary.Status status={error.status} />
      <GeneralErrorBoundary.Message message={error.message} />
      <GeneralErrorBoundary.HomeButton />
      <GeneralErrorBoundary.Stack stack={error.stack} />
    </>
  );

  const unexpectedErrorHandler: React.FC<{
    error: unknown;
  }> = ({ error }) => (
    <>
      <GeneralErrorBoundary.Title text="Something went wrong" />
      <GeneralErrorBoundary.Message message={getErrorMessage(error)} />
      <GeneralErrorBoundary.BackButton />
    </>
  );

  return (
    <Box className="GeneralErrorBoundary">
      {isRouteError
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error: {
              status,
              message,
              stack: error instanceof Error ? error.stack : undefined,
            },
            params,
          })
        : unexpectedErrorHandler({ error })}
    </Box>
  );
}

function GeneralErrorBoundaryTitle({ text }: { text: string }) {
  return (
    <Typography
      className="GeneralErrorBoundaryTitle"
      component="h1"
      variant="h4"
    >
      {text}
    </Typography>
  );
}

function GeneralErrorBoundaryStatus({
  status,
}: {
  status: string | undefined;
}) {
  return status !== undefined ? <Typography>{status}</Typography> : null;
}

function GeneralErrorBoundaryMessage({
  message,
}: {
  message: string | undefined;
}) {
  return message !== undefined ? (
    <Typography className="GeneralErrorBoundaryMessage">{message}</Typography>
  ) : null;
}

function GeneralErrorBoundaryHomeButton() {
  return (
    <Button
      className="GeneralErrorBoundaryHomeButton"
      component={Link}
      to="/"
      variant="outlined"
    >
      Return Home
    </Button>
  );
}

function GeneralErrorBoundaryBackButton() {
  const navigate = useNavigate();
  return (
    <Button
      className="GeneralErrorBoundaryBackButton"
      onClick={() => navigate(-1)}
      variant="outlined"
    >
      Go Back
    </Button>
  );
}

function GeneralErrorBoundaryStack({ stack }: { stack: string | undefined }) {
  return stack !== undefined ? (
    <pre className="GeneralErrorBoundaryStack">{stack}</pre>
  ) : null;
}

GeneralErrorBoundary.Title = GeneralErrorBoundaryTitle;
GeneralErrorBoundary.Status = GeneralErrorBoundaryStatus;
GeneralErrorBoundary.Message = GeneralErrorBoundaryMessage;
GeneralErrorBoundary.HomeButton = GeneralErrorBoundaryHomeButton;
GeneralErrorBoundary.BackButton = GeneralErrorBoundaryBackButton;
GeneralErrorBoundary.Stack = GeneralErrorBoundaryStack;

export default GeneralErrorBoundary;
