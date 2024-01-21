/// <reference types="react" />
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
declare function useListen({ onEndOfSpeech, isAiSpeaking, automatedEnd, delay, }: {
    onEndOfSpeech?: () => void;
    isAiSpeaking?: boolean;
    automatedEnd?: boolean;
    delay?: number;
}): {
    answer: string;
    answers: string[];
    loading: boolean;
    startSpeechRecognition: () => Promise<string[]>;
    stopSpeechRecognition: () => Promise<void>;
    recognizerRef: import("react").MutableRefObject<sdk.SpeechRecognizer | null>;
};
export default useListen;
