import { useState } from "react";
import { useSpeak } from "vox-sdk";
const TextToSpeech = () => {
  const [text, setText] = useState("");
  const { interruptSpeech, speak, isSpeaking } = useSpeak({
    onEnd: () => {
      console.log("Spech ended");
    },
    shouldCallOnEnd: true,
    throttleDelay: 1000,
  });

  return (
    <>
      <h3>Text To Speech</h3>
      <input type="text" onChange={(e) => setText(e.target.value)} value={text} />
      <button
        onClick={() => {
          speak(text);
        }}
        disabled={isSpeaking}
      >
        Start Speaking
      </button>
      <button
        disabled={!isSpeaking}
        onClick={() => {
          interruptSpeech();
        }}
      >
        Stop Speaking
      </button>
    </>
  );
};

export default TextToSpeech;
