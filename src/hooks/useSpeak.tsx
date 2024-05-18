//
// For more samples please visit https://github.com/Azure-Samples/cognitive-services-speech-sdk
//
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import React, { useEffect, useRef, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { useAppContext } from "../context/VoxProvider";

function useTTSwithAI({
  shouldCallOnEnd = false,
  voice = "en-US-JennyNeural",
  onEnd,
  throttleDelay = 100,
}: {
  shouldCallOnEnd: boolean;
  onEnd: () => void;
  voice?: string;
  throttleDelay?: number;
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAllSentencesBeenSpoken, setHasAllSentencesBeenSpoken] = useState(true);
  const [_currentStreamedSentence, setCurrentStreamedSentence] = useState<string>("");
  const [streamedSentences, setStreamedSentences] = useState<string[]>([]);
  const [config, setConfig] = useState<{ t: string; r: string } | null>(null);
  const didStreamCallbackGetCalled = useRef(false);

  const playerRef = React.useRef<sdk.SpeakerAudioDestination | null>(null);
  const audioConfig = React.useRef<sdk.AudioConfig | null>(null);
  const speechSythesizerRef = React.useRef<sdk.SpeechSynthesizer | null>(null);
  const { getAuthTokenAzure } = useAppContext();
  const getAuthTokenAzureApi = useRef(getAuthTokenAzure);

  const throttledCalledback = useThrottledCallback((text) => startTextToSpeech(text), throttleDelay);
  const isLocal = process.env.NODE_ENV === "development";

  const startTextToSpeech = async (text: string, _cancelEndCallback?: boolean): Promise<() => void> => {
    if (isSpeaking) Promise.reject("Already speaking");
    // Creates an audio instance.
    if (playerRef.current?.id) {
      playerRef.current?.pause();
      playerRef.current?.close();
      audioConfig.current?.close();
      playerRef.current = null;
    }
    const player = new sdk.SpeakerAudioDestination();
    playerRef.current = player;

    player.onAudioEnd = () => {
      setStreamedSentences((prev) => {
        prev = prev.slice(1);
        if (prev.length === 0) {
          setHasAllSentencesBeenSpoken(true);
          didStreamCallbackGetCalled.current = false;
          shouldCallOnEnd && onEnd();
        }
        return prev;
      });
      setIsSpeaking(false);
    };
    audioConfig.current = sdk.AudioConfig.fromSpeakerOutput(player);
    if (speechSythesizerRef.current) {
      speechSythesizerRef.current.close();
      speechSythesizerRef.current = null;
    }
    if (!config) {
      const { token, region } = (await getAuthTokenAzureApi.current()) ?? {};
      if (!token || !region) Promise.reject(`Error getting token or region`);
      setConfig({ t: token, r: region });
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechSynthesisVoiceName = voice;
      speechSythesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig.current);
    } else {
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config?.t, config?.r);
      speechConfig.speechSynthesisVoiceName = voice;
      speechSythesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig.current);
    }

    // Receives a text from console input and synthesizes it to speaker.
    try {
      speechSythesizerRef.current.speakTextAsync(
        text,
        (result) => {
          if (result) {
            // debug statement with description
            speechSythesizerRef.current?.close();
            audioConfig.current?.close();
            speechSythesizerRef.current = null;
            return result.audioData;
          }
          // Explicitly return null or undefined when there's no result
          return null; // or undefined
        },
        (error) => {
          isLocal && console.log(error);
          speechSythesizerRef.current?.close();
          audioConfig.current?.close();
          speechSythesizerRef.current = null;
        }
      );
      speechSythesizerRef.current.synthesisStarted = () => {
        // debug statement
        setIsSpeaking(true);
      };
    } catch (err) {
      console.log(`error`);
    }
    return () => {
      isLocal && console.log(`closing player`);
      playerRef.current?.pause();
      playerRef.current?.close();
      audioConfig.current?.close();
      playerRef.current = null;
      speechSythesizerRef.current?.close();
      speechSythesizerRef.current = null;
    };
  };

  useEffect(() => {
    if (!isSpeaking && streamedSentences.length > 0) {
      isLocal &&
        console.log({
          streamedSentences,
          isSpeaking,
          message: "message queue",
        });
      startTextToSpeech(streamedSentences[0]);
    }
    if (isSpeaking && streamedSentences.length === 0 && hasAllSentencesBeenSpoken) {
      setIsSpeaking(false);
      shouldCallOnEnd && onEnd();
    }
  }, [streamedSentences]);

  useEffect(() => {
    getAuthTokenAzureApi.current().then(({ token, region }) => {
      if (!token || !region) isLocal && console.log(`Error getting token or region`);
      setConfig({ t: token, r: region });
    });

    return () => {
      isLocal && console.log(`closing player`);
      playerRef.current?.pause();
      playerRef.current?.close();
      audioConfig.current?.close();
      playerRef.current = null;
      speechSythesizerRef.current?.close();
      speechSythesizerRef.current = null;
    };
  }, []);

  const interruptSpeech = () => {
    isLocal && console.log(`interrupting speech`);
    speechSythesizerRef.current?.close();
    speechSythesizerRef.current = null;
    playerRef.current?.pause();
    playerRef.current?.close();
    audioConfig.current?.close();
    playerRef.current = null;
    setIsSpeaking(false);
    setHasAllSentencesBeenSpoken(true);
    setStreamedSentences([]);
    setCurrentStreamedSentence("");
    didStreamCallbackGetCalled.current = false;
    shouldCallOnEnd && onEnd();
  };

  return {
    speak: throttledCalledback,
    isSpeaking,
    streamedSentences,
    hasAllSentencesBeenSpoken,
    speechSythesizerRef,
    interruptSpeech,
  };
}

export default useTTSwithAI;
