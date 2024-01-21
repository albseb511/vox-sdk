import { __awaiter } from "tslib";
import { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useDebouncedCallback } from "use-debounce";
import { useToken } from "../context/VoxProvider";
function useListen({ onEndOfSpeech, isAiSpeaking, automatedEnd = true, delay = 2000, }) {
    const [userHasNotSpoken, setUserHasNotSpoken] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [endOfSpeech, setEndOfSpeech] = useState(false);
    const recognizerRef = useRef(null);
    // is Local
    const isLocal = "development";
    const { token, region } = useToken();
    console.log(token, region, "yes");
    const debounced = useDebouncedCallback((resolve) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!automatedEnd)
            return;
        setEndOfSpeech(true);
        setLoading(false);
        if (!userHasNotSpoken) {
            isLocal && console.log("closing speech - debounced");
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
            recognizerRef.current = null;
        }
        isLocal && console.log("----- end of speech ------");
        if (onEndOfSpeech) {
            yield onEndOfSpeech();
            resolve && resolve(answers);
            setAnswers([]);
            setAnswer("");
        }
    }), delay);
    const [config, setConfig] = useState(null);
    const startSpeechRecognition = () => new Promise((resolve, _reject) => {
        if (recognizerRef.current) {
            recognizerRef.current.close();
            recognizerRef.current = null;
        }
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        if (!config) {
            if (!token || !region)
                return isLocal && console.log(`Error getting token or region`);
            setConfig({ t: token, r: region });
            const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
            speechConfig.speechRecognitionLanguage = "en-US";
            recognizerRef.current = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        }
        else {
            const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config === null || config === void 0 ? void 0 : config.t, config === null || config === void 0 ? void 0 : config.r);
            speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
            recognizerRef.current = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        }
        // debug statement
        isLocal && console.log("starting to recognise");
        setLoading(true);
        recognizerRef.current.recognizing = (_s, e) => {
            isLocal && console.log(`RECOGNIZING: Text=${e.result.text}`);
            if (isAiSpeaking)
                return;
            setAnswer(e.result.text);
            debounced(resolve);
        };
        recognizerRef.current.recognized = (_s, e) => {
            if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
                isLocal && console.log(`RECOGNIZED: Text=${e.result.text}`);
                if (isAiSpeaking)
                    return;
                setAnswers((prev) => [...prev, e.result.text]);
                // debug
                isLocal && console.log("calling debounce");
                debounced(resolve);
                setUserHasNotSpoken(false);
            }
            else if (e.result.reason == sdk.ResultReason.NoMatch) {
                setUserHasNotSpoken(true);
                isLocal && console.log("NOMATCH: Speech could not be recognized.");
            }
        };
        recognizerRef.current.canceled = (_s, e) => {
            var _a;
            isLocal && console.log(`CANCELED: Reason=${e.reason}`);
            if (e.reason == sdk.CancellationReason.Error) {
                isLocal && console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
                isLocal && console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
                isLocal && console.log("CANCELED: Did you set the speech resource key and region values?");
            }
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.stopContinuousRecognitionAsync();
        };
        recognizerRef.current.sessionStopped = (_s, _e) => {
            var _a;
            isLocal && console.log("\n    Session stopped event.");
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.stopContinuousRecognitionAsync();
        };
        recognizerRef.current.startContinuousRecognitionAsync(function () {
            // debug statement
            isLocal && console.log(`Start of speech`);
        }, function (err) {
            var _a;
            window.console.log(err);
            isLocal && console.log("closing speech - error");
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
            setLoading(false);
        });
    });
    useEffect(() => {
        var _a;
        if (endOfSpeech && !userHasNotSpoken) {
            isLocal && console.log("closing speech - useEffect");
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
        }
    }, [endOfSpeech]);
    const stopSpeechRecognition = () => __awaiter(this, void 0, void 0, function* () {
        var _b, _c;
        (_b = recognizerRef.current) === null || _b === void 0 ? void 0 : _b.stopContinuousRecognitionAsync();
        setLoading(false);
        isLocal && console.log("closing speech - stopSpeechRecognition");
        (_c = recognizerRef.current) === null || _c === void 0 ? void 0 : _c.close();
        recognizerRef.current = null;
        setAnswers([]);
        setAnswer("");
    });
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
//# sourceMappingURL=useListen.js.map