import type { ContainerProps } from '@mui/material';
import { Box, Container, Link, Typography } from '@mui/material';
import { Link as RemixLink } from '@remix-run/react';
import classNames from 'classnames';
import * as React from 'react';

import type { AuditProps } from '~/components';
import { Audit, Header } from '~/components';
import type { User } from '~/models/user.server';
import { getBem } from '~/utils/bem';

import './Page.css';

interface PageProps {
  children: React.ReactNode;
  className?: string;
  disablePadding?: boolean;
  header?: boolean;
  maxWidth?: ContainerProps['maxWidth'];
  user?: User | undefined;
}

function Page({
  children,
  className,
  disablePadding = false,
  header = true,
  maxWidth = 'xl',
  user,
}: PageProps) {
  const bem = getBem('Page');
  return (
    <>
      {header ? <Header user={user} /> : null}
      <Box
        className={classNames(
          bem('Page', disablePadding ? 'Page--disablePadding' : null),
          className,
        )}
        component="main"
      >
        <Container maxWidth={maxWidth}>{children}</Container>
      </Box>
    </>
  );
}

interface PageHeaderProps {
  actions?: React.ReactNode;
  audit?: AuditProps;
  breadcrumbs?: { label: string; to: string }[];
  title: string;
  titleEnd?: React.ReactNode;
}

function PageHeader({
  actions,
  audit,
  breadcrumbs,
  title,
  titleEnd,
}: PageHeaderProps) {
  const bem = getBem('PageHeader');
  return (
    <Box className={bem('PageHeader')}>
      <Box>
        <Box className={bem('PageHeader__breadcrumbs')}>
          {breadcrumbs?.map(({ label, to }) => (
            <React.Fragment key={to}>
              <Link
                className={bem('PageHeader__breadcrumb')}
                component={RemixLink}
                to={to}
                underline="hover"
                variant="caption"
              >
                {label}
              </Link>
              <Typography
                className={bem('PageHeader__breadcrumbSeparator')}
                variant="caption"
              >
                /
              </Typography>
            </React.Fragment>
          ))}
        </Box>
        <Box className={bem('PageHeader__titleContainer')}>
          <Typography
            className={bem('PageHeader__title')}
            component="h1"
            variant="h6"
          >
            {title}
          </Typography>
          {titleEnd !== undefined ? titleEnd : null}
        </Box>
        <Box className={bem('PageHeader__audit')}>
          {audit !== undefined ? <Audit {...audit} /> : null}
        </Box>
      </Box>
      {actions}
    </Box>
  );
}

Page.Header = PageHeader;

export default Page;
