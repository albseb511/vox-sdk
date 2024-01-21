import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import React from "react";
declare function useTTSwithAI({ shouldCallOnEnd, onEnd, }: {
    shouldCallOnEnd: boolean;
    onEnd: () => void;
    prompt?: string;
    submission_id: string | undefined;
    question_id: string | undefined;
    voice_code?: string;
    mode?: "conversation" | "editor";
}): {
    speak: import("use-debounce").DebouncedState<(text: any) => Promise<() => void>>;
    isSpeaking: boolean;
    streamedSentences: string[];
    hasAllSentencesBeenSpoken: boolean;
    speechSythesizerRef: React.MutableRefObject<sdk.SpeechSynthesizer | null>;
    interruptSpeech: () => void;
};
export default useTTSwithAI;
