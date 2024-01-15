import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Box, Tooltip, Typography } from '@mui/material';

import { getBem } from '~/utils/bem';
import { dateToString, getRelativeTime } from '~/utils/date';

import './Audit.css';

export enum AuditWhat {
  Created = 'created',
  Updated = 'updated',
}

export interface AuditProps {
  showWhat?: boolean;
  what: AuditWhat;
  when: Date;
  who: string;
}

export default function Audit({
  showWhat = true,
  what,
  when,
  who,
}: AuditProps) {
  const bem = getBem('Audit');

  return (
    <Box className={bem('Audit')}>
      <CalendarTodayIcon className={bem('Audit__icon')} />
      <Typography className={bem('Audit__text')} variant="caption">
        {showWhat ? `${what} ` : ''}
        <Tooltip
          arrow
          title={`${!showWhat ? `${what} ` : ''}${dateToString(when, {
            showTime: true,
          })}`}
        >
          <time
            className={bem('Audit__time')}
            dateTime={new Date(when).toISOString()}
          >
            {getRelativeTime(new Date(when))}
          </time>
        </Tooltip>{' '}
        by <strong>{who}</strong>
      </Typography>
    </Box>
  );
}
