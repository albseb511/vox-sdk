import { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useDebouncedCallback } from "use-debounce";
import getAuthTokenAzure from "../utils/getAuthTokenAzure";
import { useToken } from "../context/VoxProvider";



function useListen({
  onEndOfSpeech,
  isAiSpeaking,
  automatedEnd = true,
  delay = 2000
}: {
  onEndOfSpeech?: () => void;
  isAiSpeaking?: boolean;
  automatedEnd?: boolean;
  delay?: number;
}) {
  const [userHasNotSpoken, setUserHasNotSpoken] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [endOfSpeech, setEndOfSpeech] = useState<boolean>(false);
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  // is Local
  const isLocal =  "development";
  const {token, region} = useToken()

  const debounced = useDebouncedCallback(async (resolve) => {
    if(!automatedEnd) return
    setEndOfSpeech(true);
    setLoading(false);
    if (!userHasNotSpoken) {
      isLocal && console.log("closing speech - debounced");
      recognizerRef.current?.close();
      recognizerRef.current = null;
    }
    isLocal && console.log("----- end of speech ------");
    if (onEndOfSpeech) {
      await onEndOfSpeech();
      resolve && resolve(answers);
      setAnswers([]);
      setAnswer("");
    }
  }, delay);

  const [config, setConfig] = useState<{ t: string; r: string } | null>(null);

  const startSpeechRecognition: () => Promise<string[]> = () =>
    new Promise(async (resolve, reject) => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
        recognizerRef.current = null;
      }
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      if (!config) {
        if (!token || !region)
          return isLocal && console.log(`Error getting token or region`);
        setConfig({ t: token, r: region });
        const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
          token,
          region
        );
        speechConfig.speechRecognitionLanguage = "en-US";
        recognizerRef.current = new sdk.SpeechRecognizer(
          speechConfig,
          audioConfig
        );
      } else {
        const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
          config?.t,
          config?.r
        );
        speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
        recognizerRef.current = new sdk.SpeechRecognizer(
          speechConfig,
          audioConfig
        );
      }

      // debug statement
      isLocal && console.log("starting to recognise");
      setLoading(true);

      recognizerRef.current.recognizing = (s, e) => {
        isLocal && console.log(`RECOGNIZING: Text=${e.result.text}`);
        if (isAiSpeaking) return;
        setAnswer(e.result.text);
        debounced(resolve);
      };

      recognizerRef.current.recognized = (s, e) => {
        if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
          isLocal && console.log(`RECOGNIZED: Text=${e.result.text}`);
          if (isAiSpeaking) return;
          setAnswers((prev) => [...prev, e.result.text]);
          // debug
          isLocal && console.log("calling debounce");
          debounced(resolve);
          setUserHasNotSpoken(false);
        } else if (e.result.reason == sdk.ResultReason.NoMatch) {
          setUserHasNotSpoken(true);
          isLocal && console.log("NOMATCH: Speech could not be recognized.");
        }
      };

      recognizerRef.current.canceled = (s, e) => {
        isLocal && console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason == sdk.CancellationReason.Error) {
          isLocal && console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
          isLocal && console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
          isLocal &&
            console.log(
              "CANCELED: Did you set the speech resource key and region values?"
            );
        }

        recognizerRef.current?.stopContinuousRecognitionAsync();
      };

      recognizerRef.current.sessionStopped = (s, e) => {
        isLocal && console.log("\n    Session stopped event.");
        recognizerRef.current?.stopContinuousRecognitionAsync();
      };

      recognizerRef.current.startContinuousRecognitionAsync(
        function () {
          // debug statement
          isLocal && console.log(`Start of speech`);
        },
        function (err) {
          window.console.log(err);
          isLocal && console.log("closing speech - error");
          recognizerRef.current?.close();
          setLoading(false);
        }
      );
    });

  useEffect(() => {
    if (endOfSpeech && !userHasNotSpoken) {
      isLocal && console.log("closing speech - useEffect");
      recognizerRef.current?.close();
    }
  }, [endOfSpeech]);

  const stopSpeechRecognition = async () => {
    recognizerRef.current?.stopContinuousRecognitionAsync();
    setLoading(false);
    isLocal && console.log("closing speech - stopSpeechRecognition");
    recognizerRef.current?.close();
    recognizerRef.current = null;
    setAnswers([]);
    setAnswer("");
  };

  useEffect(() => {
    return () => {
      isLocal && console.log("closing speech - UEH-END");
      stopSpeechRecognition();
    };
  }, []);
  
  return {
    answer,
    answers,
    loading,
    startSpeechRecognition,
    stopSpeechRecognition,
    recognizerRef,
  };
}

export default useListen;
