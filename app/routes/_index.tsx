import {
  Autocomplete,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';

import { Page } from '~/components';
import films from '~/films';

import './_index.css';

type Film = (typeof films)[0];

const MINIMUM_SEARCH_LENGTH = 3;

export const meta = () => [{ title: 'MYLISTS' }];

export default function Index() {
  const [watchlist, setWatchList] = React.useState<Film['label'][]>(
    films.slice(5, 40).map((film) => film.label),
  );
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
              paddingY: 1,
              pl: 2,
              fontSize: 18,
              color: 'text.secondary',
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                color: 'text.primary',
              }}
            >
              {movie}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Autocomplete
        autoHighlight
        clearOnBlur={false}
        disablePortal
        filterOptions={(options, state) => {
          if (state.inputValue.length >= MINIMUM_SEARCH_LENGTH) {
            return options.filter((item) =>
              item.label.toLowerCase().includes(state.inputValue.toLowerCase()),
            );
          }
          return [];
        }}
        fullWidth
        getOptionDisabled={(option) => watchlist.includes(option.label)}
        inputValue={inputValue}
        noOptionsText={
          inputValue.length >= MINIMUM_SEARCH_LENGTH
            ? 'No results'
            : 'Type minimum 3 characters to search'
        }
        onChange={(_event, value) => {
          if (value !== null) {
            const isAlreadyInList = watchlist.some(
              (movie) => movie === value.label,
            );

            if (!isAlreadyInList) {
              setWatchList([...watchlist, value.label]);
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
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for movie to add..."
            variant="outlined"
          />
        )}
        size="medium"
        sx={{ pt: 1 }}
        value={value}
      />
    </Page>
  );
}
