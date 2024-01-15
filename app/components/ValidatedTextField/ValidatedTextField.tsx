import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import { useField } from 'remix-validated-form';

type ValidatedTextFieldProps = Omit<
  TextFieldProps,
  'id' | 'helperText' | 'name'
> & {
  name: string;
  useFieldOptions?: Parameters<typeof useField>[1];
};

export default function ValidatedTextField({
  name,
  useFieldOptions,
  ...props
}: ValidatedTextFieldProps) {
  const { error, getInputProps } = useField(name, useFieldOptions);

  return (
    <TextField
      {...props}
      {...getInputProps({ id: name })}
      error={error !== undefined}
      helperText={error}
    />
  );
}
