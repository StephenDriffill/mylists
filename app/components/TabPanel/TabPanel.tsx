import { Box } from '@mui/material';


import { getBem } from '~/utils/bem';

import './TabPanel.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  renderInactiveContent?: boolean;
  selectedTabIndex: number;
}

function getTabPanelId(index: number) {
  return `tabpanel-${index}`;
}

export function getTabProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': getTabPanelId(index),
  };
}

export default function TabPanel({
  children,
  index,
  renderInactiveContent = true,
  selectedTabIndex,
  ...other
}: TabPanelProps) {
  const isActive = selectedTabIndex === index;

  const bem = getBem('TabPanel');

  return (
    <Box
      aria-labelledby={getTabProps(index).id}
      className={bem('TabPanel', isActive ? 'TabPanel--active' : null)}
      id={getTabPanelId(index)}
      role="tabpanel"
      {...other}
    >
      {isActive || renderInactiveContent ? (
        <Box className={bem('TabPanel__content')}>{children}</Box>
      ) : null}
    </Box>
  );
}
