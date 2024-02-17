import { Autocomplete, TextField, Typography } from '@mui/material';
import * as React from 'react';

import { Page } from '~/components';

export const meta = () => [{ title: 'MYLISTS' }];

const films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

export default function Index() {
  const [watchlist, setWatchList] = React.useState<typeof films>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    setInputValue('');
    setValue(null);
  }, [watchlist]);

  return (
    <Page>
      {watchlist.map((movie, index) => (
        <Typography key={index}>{movie.label}</Typography>
      ))}
      <Autocomplete
        clearOnBlur={false}
        disablePortal
        inputValue={inputValue}
        onChange={(_event, value) => {
          if (value !== null) {
            const isAlreadyInList = watchlist.some(
              (movie) => movie.label === value.label,
            );

            if (!isAlreadyInList) {
              setWatchList([...watchlist, value]);
            }
          }
        }}
        onInputChange={(event, newInputValue) => {
          // prevent input change flicker when the value is selected
          if (event.type === 'click') {
            return;
          }
          if (
            event.type === 'keydown' &&
            'key' in event &&
            event.key === 'Enter'
          ) {
            return;
          }

          setInputValue(newInputValue);
        }}
        options={films}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: 300 }}
        value={value}
      />
    </Page>
  );
}
