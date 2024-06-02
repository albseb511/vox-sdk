import React from "react";
import "./App.css";
import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";
function App() {
  return (
    <>
      <h1>Thanks for using vox-sdk</h1>
      <SpeechToText />
      <br />
      <TextToSpeech />
    </>
  );
}

export default App;
