import type { DialogProps as MuiDialogProps } from '@mui/material';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import classNames from 'classnames';
import * as React from 'react';

import { ConditionalWrapper } from '~/components';

export type DialogProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  title?: string;
  wrapper?: (wrapperChildren: React.ReactNode) => React.ReactNode;
} & Pick<
  MuiDialogProps,
  'disableRestoreFocus' | 'maxWidth' | 'open' | 'transitionDuration'
>;

export default function Dialog({
  actions,
  children,
  className,
  title,
  wrapper,
  ...rest
}: DialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MuiDialog
      className={classNames('Dialog', className)}
      fullScreen={fullScreen}
      {...rest}
    >
      <DialogTitle>{title}</DialogTitle>

      <ConditionalWrapper
        showWrapper={wrapper !== undefined}
        wrapper={wrapper!}
      >
        <DialogContent>{children}</DialogContent>

        {actions !== undefined ? (
          <DialogActions>{actions}</DialogActions>
        ) : null}
      </ConditionalWrapper>
    </MuiDialog>
  );
}
