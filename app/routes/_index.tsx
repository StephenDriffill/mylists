import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
  Autocomplete,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { json } from '@remix-run/node';
import * as React from 'react';

import { Page } from '~/components';
import films from '~/films';

import './_index.css';

type Film = (typeof films)[0];

const MINIMUM_SEARCH_LENGTH = 3;
const MAX_OPTIONS = 10;

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list); // clone the list
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function getListStyle(isDraggingOver: boolean) {
  return {
    // background: isDraggingOver ? 'lightblue' : undefined,
    // padding: grid,
  };
}

function getListItemStyle(isDragging: boolean, draggableStyle: any) {
  return {
    userSelect: 'none',
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,
    // bgcolor: isDragging ? 'text.secondary' : undefined,

    // styles we need to apply on draggables
    ...draggableStyle,
  };
}

function getTypographyStyle(isDragging: boolean) {
  return {
    bgcolor: isDragging ? 'text.secondary' : undefined,
    borderRadius: 1,
    paddingY: 0.5,
    paddingX: 0.5,
  };
}

export const meta = () => [{ title: 'MYLISTS' }];

export const loader = async () => {
  return json({});
};

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
      <Box sx={{ display: 'flex' }}>
        <List>
          {watchlist.map((movie, index) => (
            <ListItem disablePadding key={movie} sx={{ height: 40 }}>
              <ListItemText
                sx={{
                  fontSize: 18,
                  color: 'text.secondary',
                }}
              >
                {index + 1}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <DragDropContext
          onDragEnd={(result) => {
            setWatchList((prev) => {
              // dropped outside the list
              if (result.destination === null) {
                return prev;
              }
              return reorder(
                prev,
                result.source.index,
                result.destination.index,
              );
            });
          }}
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={getListStyle(snapshot.isDraggingOver)}
              >
                {watchlist.map((movie, index) => (
                  <Draggable draggableId={movie} index={index} key={movie}>
                    {(provided, snapshot) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          // fontSize: 20,
                          height: 40,
                          color: 'text.primary',
                          ...getListItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          ),
                        }}
                      >
                        <ListItemText disableTypography>
                          <Typography
                            component="span"
                            noWrap
                            sx={getTypographyStyle(snapshot.isDragging)}
                          >
                            {movie}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <Autocomplete
        autoHighlight
        clearOnBlur={false}
        disablePortal
        filterOptions={(options, state) => {
          if (state.inputValue.length >= MINIMUM_SEARCH_LENGTH) {
            return options
              .filter((item) =>
                item.label
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase()),
              )
              .slice(0, MAX_OPTIONS);
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
