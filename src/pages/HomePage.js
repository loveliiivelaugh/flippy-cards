import React, { useState } from 'react'
import { useSpring, a } from '@react-spring/web'
import { Button, Container, IconButton, Grid, Typography } from '@mui/material'
// import { MenuIcon } from '@mui/icons-material';
// import { useRouter } from './hooks/useRouter';
import styles from './styles.module.css'
import { useLocalStorage } from '../hooks/useLocalStorage';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { makeStyles } from '@material-ui/core/styles';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const useStyles = makeStyles(theme => ({
  root: {
  },
  button: {},
  container: {height:'100vh',width:'100vw',margin:'auto', display: 'flex'}
}));


const HomePage = () => {
  const classes = useStyles();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const wordStorage = useLocalStorage("wordStorage")
  
  const [state, setState] = useState({
    isListening: false,
    transcript: '',
    wordCount: 0,
    mode: "",
    flipped: false,
    emptyLetters: []
  })

  const { transform, opacity } = useSpring({
    opacity: state.flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${state.flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const words = wordStorage[0].words

  const handlePrev = () => setState((prevState, { wordCount }) => ({ ...prevState, wordCount }))
  const handleNext = () => setState((prevState, { wordCount }) => ({ ...prevState, wordCount }))

  const handleKeyDown = (e) => {
    console.log(e.key, state.flipped, state.mode)
    if (state.flipped && state.mode === "typing") {
      if (state.emptyLetters.includes(e.key)) {
        const letterIndex = state.emptyLetters.indexOf(e.key)
        const updatedLetters = state.emptyLetters.splice(letterIndex, 1, e.key)
        setState({ ...state, emptyLetters: updatedLetters })
      }
    }
  }

  const handleListening = () => {

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return (
        <Container>
          Browser does not Support Speech Recognition
        </Container>
      )
    }

    SpeechRecognition.startListening({ continuous: true })
    setState({ ...state, isListening: true })
  }

  const handleStopListening = () => {
    SpeechRecognition.stopListening()
    setState({ ...state, isListening: false })
  }

  const handleMicrophone =  () => {
    setState({ ...state, mode: "speaking" })
    state.isListening ? handleStopListening() : handleListening();
  }

  const handleKeyboard = () => {
    setState({ ...state, mode: "typing" })
  }

  const emptyLetters = word => {
    let emptyLetters = []
    word.split("").forEach(letter => emptyLetters.push("_ "))
    emptyLetters.join("")
    // setState({ ...state, emptyLetters })
    return emptyLetters
  }

  console.log(
    "flipped?", state.flipped,
    "listening", listening,
    "transcript", transcript
    )

  return (
    <Container maxWidth="xl" className={classes.container} onKeyDown={e => handleKeyDown(e)} tabIndex={0}>
      <Button variant="outlined" color="primary" onClick={() => handlePrev()} disabled={state.wordCount < 1}>
        {`<`}
      </Button>
      <Container className={styles.container} onClick={() => setState(state => ({...state, flipped: !state.flipped }))}>
        <Grid container>
        {state.mode === "" ? (
          <Grid item xs={12}>
            <Typography variant="body1" component="h1" gutterBottom>
              Please select a game mode.
            </Typography>
          </Grid>
        ) : null}
          <IconButton onClick={e => handleMicrophone()} color={state.mode === "speaking" ? 'success' : 'default'}>
            <RecordVoiceOverIcon />
          </IconButton>
          <IconButton onClick={e => handleKeyboard()}  color={state.mode === "typing" ? 'success' : 'default'}>
            <KeyboardIcon />
          </IconButton>
        </Grid>
        <a.div
          className={`${styles.c} ${styles.back}`}
          style={{ opacity: opacity.to(o => 1 - o), transform }}
        >
          <Typography variant="h4" className={styles.word} style={{margin:'auto'}}>
            {words[state.wordCount]}
          </Typography>
        </a.div>
        <a.div
          className={`${styles.c} ${styles.front}`}
          style={{
            opacity,
            transform,
            rotateX: '180deg',
          }}
        >
          <Typography variant="h4" className={styles.word} style={{margin:'auto'}}>
            {emptyLetters(words[state.wordCount])}
          </Typography>
        </a.div>
      </Container>
      <Button variant="outlined" color="primary" onClick={() => handleNext()} disabled={state.wordCount >= words.length - 1}>
        {`>`}
      </Button>
    </Container>
  )
}

export default HomePage
