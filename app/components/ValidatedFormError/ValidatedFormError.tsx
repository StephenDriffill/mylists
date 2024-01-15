import { FormHelperText } from '@mui/material';
import type { ValidatorError } from 'remix-validated-form';
import { useField } from 'remix-validated-form';

const defaultFieldName = 'form';

// mock a ValidatorError for a dummy "form" field
export function formValidationError(
  error: string,
  name?: string,
): ValidatorError {
  const fieldName = name ?? defaultFieldName;
  return { fieldErrors: { [fieldName]: error } };
}

interface ValidatedFormErrorProps {
  name?: string;
}

export default function ValidatedFormError({
  name = defaultFieldName,
}: ValidatedFormErrorProps) {
  const { error } = useField(name);
  const hasError = error !== undefined;

  return <FormHelperText error={hasError}>{error}</FormHelperText>;
}
