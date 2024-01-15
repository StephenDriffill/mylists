import type { CheckboxProps } from '@mui/material';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { useField } from 'remix-validated-form';

type ValidatedCheckbox = Omit<CheckboxProps, 'id' | 'value'> & {
  label?: string;
  name: string;
  useFieldOptions?: Parameters<typeof useField>[1];
};

export default function ValidatedCheckbox({
  label,
  name,
  useFieldOptions,
  ...props
}: ValidatedCheckbox) {
  const { error, getInputProps } = useField(name, useFieldOptions);

  return (
    <FormControl fullWidth variant="standard">
      <FormControlLabel
        control={
          <Checkbox {...props} {...getInputProps({ id: name, value: 'on' })} />
        }
        label={label}
      />
      <FormHelperText error={error !== undefined}>{error}</FormHelperText>
    </FormControl>
  );
}
