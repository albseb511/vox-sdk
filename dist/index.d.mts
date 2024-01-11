import * as React from 'react';
import React__default from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import * as use_debounce from 'use-debounce';

interface VoxProviderConfig {
    baseUrl: string;
}
interface GetAuthResponse {
    token: string;
    region: string;
}
interface AppContextType {
    getAuthTokenAzure: () => Promise<GetAuthResponse>;
    token: string;
    region: string;
}

declare function useListen({ onEndOfSpeech, isAiSpeaking, automatedEnd, delay }: {
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
    recognizerRef: React.MutableRefObject<sdk.SpeechRecognizer>;
};

declare function useTTSwithAI({ shouldCallOnEnd, onEnd, }: {
    shouldCallOnEnd: boolean;
    onEnd: () => void;
    prompt?: string;
    submission_id: string | undefined;
    question_id: string | undefined;
    voice_code?: string;
    mode?: "conversation" | "editor";
}): {
    speak: use_debounce.DebouncedState<(text: any) => Promise<() => void>>;
    isSpeaking: boolean;
    streamedSentences: string[];
    hasAllSentencesBeenSpoken: boolean;
    speechSythesizerRef: React__default.MutableRefObject<sdk.SpeechSynthesizer>;
    interruptSpeech: () => void;
};

declare const obj: {
    VoxProvider: React.FC<{
        children: React.ReactNode;
        config: VoxProviderConfig;
    }>;
    useListen: typeof useListen;
    useAppContext: () => AppContextType;
    useToken: () => {
        token: string;
        region: string;
        loading: boolean;
        error: Error;
    };
    useSpeak: typeof useTTSwithAI;
};

export { obj as default };
