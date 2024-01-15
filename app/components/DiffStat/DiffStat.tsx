import { Box, Typography } from '@mui/material';
import classNames from 'classnames';

import { getBem } from '~/utils/bem';

import './DiffStat.css';

interface DiffStatProps {
  added: number;
  className?: string;
  deleted: number;
  total: number;
}

const bem = getBem('DiffStat');

export default function DiffStat({
  added,
  className,
  deleted,
  total,
}: DiffStatProps) {
  if (total < 0 || added < 0 || deleted < 0 || total < added + deleted) {
    return null;
  }

  const BLOCK_COUNT = 5;
  const BLOCK_FRACTION = 1 / BLOCK_COUNT;
  const noTotal = total === 0;

  const addedDecimal = noTotal ? 0 : added / total;
  const addedBlockCount = Math.round(addedDecimal / BLOCK_FRACTION);
  const deletedDecimal = noTotal ? 0 : deleted / total;
  const deletedBlockCount = Math.round(deletedDecimal / BLOCK_FRACTION);

  return (
    <Box className={classNames(bem('DiffStat'), className)}>
      <Typography className={bem('DiffStat__count', 'DiffStat__count--added')}>
        +{added}
      </Typography>
      <Typography
        className={bem('DiffStat__count', 'DiffStat__count--deleted')}
      >
        -{deleted}
      </Typography>
      {Array.from({ length: BLOCK_COUNT }).map((_, i) => {
        const blockType =
          i < addedBlockCount
            ? 'added'
            : i < addedBlockCount + deletedBlockCount
            ? 'deleted'
            : 'neutral';
        return (
          <span
            className={bem('DiffStat__block', `DiffStat__block--${blockType}`)}
            key={`block-${i}`}
          />
        );
      })}
    </Box>
  );
}
