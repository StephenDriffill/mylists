import type { ButtonProps } from '@mui/material';
import { Button, Typography } from '@mui/material';

import type { DialogProps } from '~/components';
import { Dialog } from '~/components';

interface ConfirmationDialogProps {
  children?: DialogProps['children'];
  confirmButton: { color?: ButtonProps['color']; text: string };
  consequence: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  open: DialogProps['open'];
  question: `${string}?`;
  transitionDuration?: DialogProps['transitionDuration'];
  wrapper?: DialogProps['wrapper'];
}
export default function ConfirmationDialog({
  children,
  confirmButton,
  consequence,
  onCancel,
  onConfirm,
  open,
  question,
  transitionDuration,
  wrapper,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button color="inherit" onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            color={confirmButton.color}
            onClick={onConfirm}
            variant="contained"
          >
            {confirmButton.text}
          </Button>
        </>
      }
      open={open}
      title={question}
      transitionDuration={transitionDuration}
      wrapper={wrapper}
    >
      <Typography>{consequence}</Typography>
      {children}
    </Dialog>
  );
}
