import type { FormHelperTextProps, SelectProps } from '@mui/material';
import {
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import classNames from 'classnames';

import { ConditionalWrapper } from '~/components';
import { ellipsize } from '~/utils/string';

import './MultiSelect.css';

const MAX_DESCRIPTION_LENGTH = 30;

export type MultiSelectItem = {
  description?: string | null;
  id: string;
  name?: string;
};
export type MultiSelectProps = Omit<SelectProps<string[]>, 'multiple'> & {
  helperText?: FormHelperTextProps['children'];
  items: MultiSelectItem[];
};

export default function MultiSelect({
  className,
  error,
  helperText,
  items,
  ...props
}: MultiSelectProps) {
  return (
    <FormControl error={error} fullWidth margin="normal">
      <InputLabel id={props.labelId}>{props.label}</InputLabel>
      <Select
        {...props}
        className={classNames('MultiSelect', className)}
        multiple
        renderValue={(selected) =>
          selected.map((id) => {
            const label = items.find((item) => item.id === id)?.name ?? id;

            return (
              <Chip
                className="MultiSelect__chip"
                key={id}
                label={label}
                size="small"
              />
            );
          })
        }
      >
        {items.map(({ description, id, name }) => (
          <MenuItem className="MultiSelect__menuItem" key={id} value={id}>
            <ListItemText>{name ?? id}</ListItemText>
            {description !== undefined && description !== null ? (
              <ConditionalWrapper
                showWrapper={description.length > MAX_DESCRIPTION_LENGTH}
                wrapper={(wrapperChildren) => (
                  <Tooltip title={description}>{wrapperChildren}</Tooltip>
                )}
              >
                <Typography color="text.secondary" variant="body2">
                  {ellipsize(description, MAX_DESCRIPTION_LENGTH)}
                </Typography>
              </ConditionalWrapper>
            ) : null}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
}
