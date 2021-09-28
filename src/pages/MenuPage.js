import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, InputLabel } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { Button, List, ListItem, ListItemText } from '@material-ui/core';
import { useLocalStorage } from '../hooks/useLocalStorage';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    margin:'auto',
    height: '100vh',
    width: '100vw',
  }
}));

const MenuPage = () => {
  const classes = useStyles();
  const [state, setState] = useLocalStorage("wordStorage", {
    word: '',
    words: []
  });

  const handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)
    setState({ ...state, words: [...state.words, state.word] });
    console.log(state)
    document.getElementById('word').value = '';
  };

  return (
    <Container maxWidth="xl" classnames={classes.container}>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={e => handleSubmit(e)}
      >
        <InputLabel htmlFor="word">Enter your words</InputLabel>
        <TextField id="word" label="Outlined" variant="outlined" name="word" onChange={e => handleChange(e)}/>
        <Button type="submit" variant="contained" color="primary">
          Enter
        </Button>
      </Box>
      <Box>
        <List>
          {state.words.map((word, index) => (
            <ListItem key={index}>
              <ListItemText primary={word} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  )
}

export default MenuPage
