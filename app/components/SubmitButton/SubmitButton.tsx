import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';

import { INTENT_ENTRY_KEY } from '~/utils/validation';

type SubmitButtonProps = Omit<ButtonProps, 'name' | 'type' | 'value'> & {
  intent?: string;
};

export default function SubmitButton({
  children,
  intent,
  variant = 'contained',
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      name={intent !== undefined ? INTENT_ENTRY_KEY : undefined}
      type="submit"
      value={intent}
      variant={variant}
    >
      {children}
    </Button>
  );
}
