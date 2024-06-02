import { useListen } from "vox-sdk";

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
      <h3>Speech To Text</h3>
      <button disabled={loading} onClick={startSpeechRecognition}>
        Start Litsening
      </button>
      <button onClick={stopSpeechRecognition}> Stop Listening</button>
    </>
  );
};

export default SpeechToText;
