import { useListen } from "vox-sdk";
import React from "react";
const SpeechToText = () => {
  const { answers, loading, startSpeechRecognition, stopSpeechRecognition } = useListen({
    onEndOfSpeech: () => {
      console.log(answers);
    },
    automatedEnd: true,
    delay: 1000,
  });
  return (
    <>
      <button disabled={loading} onClick={startSpeechRecognition}>
        Start Litsening
      </button>
      <button onClick={stopSpeechRecognition}> Stop Listening</button>
    </>
  );
};

export default SpeechToText;
