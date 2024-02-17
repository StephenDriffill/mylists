import {
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import * as React from 'react';

import { Page } from '~/components';
import films from '~/films';

export const meta = () => [{ title: 'MYLISTS' }];

export default function Index() {
  const [watchlist, setWatchList] = React.useState<typeof films>([
    films[2],
    films[3],
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    setInputValue('');
    setValue(null);
  }, [watchlist]);

  return (
    <Page>
      <List>
        {watchlist.map((movie, index) => (
          <ListItem
            disablePadding
            key={index}
            sx={{
              display: 'list-item',
              listStyle: 'decimal',
              ml: 3,
              paddingY: 0.25,
            }}
          >
            <ListItemText>{movie.label}</ListItemText>
          </ListItem>
        ))}
      </List>
      <Autocomplete
        autoHighlight
        clearOnBlur={false}
        disablePortal
        fullWidth
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
        value={value}
      />
    </Page>
  );
}
