import type { ToggleButtonGroupProps, ToggleButtonProps } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface RadioButtonGroupItem {
  label: ToggleButtonProps['children'];
  value: NonNullable<ToggleButtonProps['key']>;
}

interface RadioButtonGroupProps {
  items: RadioButtonGroupItem[];
  label: ToggleButtonGroupProps['aria-label'];
  onChange: ToggleButtonGroupProps['onChange'];
  value: ToggleButtonGroupProps['value'];
}

export default function RadioButtonGroup({
  items,
  label,
  onChange,
  value,
}: RadioButtonGroupProps) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      color="primary"
      exclusive
      onChange={onChange}
      size="small"
      value={value}
    >
      {items.map((item) => (
        <ToggleButton key={item.value} value={item.value}>
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
