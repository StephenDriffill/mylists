import type { FormHelperTextProps } from '@mui/material';
import { useField, useFormContext } from 'remix-validated-form';

import type { MultiSelectItem, MultiSelectProps } from '~/components';
import { FormHelperTextList, MultiSelect } from '~/components';

type ValidatedMultiSelectProps = Omit<MultiSelectProps, 'items'> & {
  helperText?: FormHelperTextProps['children'];
  items: MultiSelectItem[];
  name: string;
  useFieldOptions?: Parameters<typeof useField>[1];
};

export default function ValidatedMultiSelect({
  items,
  name,
  useFieldOptions,
  ...props
}: ValidatedMultiSelectProps) {
  const { getInputProps } = useField(name, useFieldOptions);
  const { fieldErrors: allFieldErrors } = useFormContext();

  /**
   * Validation errors at the item level are keyed by `name[0]`, `name[1]`, etc.
   * rather than `name`. We cannot extract them using `useField` because this
   * only returns the top level `name` error. So we have to parse them out of
   * the `fieldErrors` context :(

   * https://github.com/airjp73/remix-validated-form/discussions/82
   */
  const fieldErrors = Object.entries(allFieldErrors).reduce((errors, error) => {
    const [fieldName, errorMessage] = error;
    if (fieldName === name || fieldName.startsWith(`${name}[`)) {
      return [...errors, errorMessage];
    }
    return errors;
  }, [] as string[]);

  return (
    <>
      <MultiSelect
        {...props}
        {...getInputProps({ id: name, items })}
        error={fieldErrors.length > 0}
        helperText={<FormHelperTextList items={fieldErrors} />}
        items={items}
      />
    </>
  );
}
