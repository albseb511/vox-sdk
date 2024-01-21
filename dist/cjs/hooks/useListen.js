"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const sdk = tslib_1.__importStar(require("microsoft-cognitiveservices-speech-sdk"));
const use_debounce_1 = require("use-debounce");
const VoxProvider_1 = require("../context/VoxProvider");
function useListen({ onEndOfSpeech, isAiSpeaking, automatedEnd = true, delay = 2000, }) {
    const [userHasNotSpoken, setUserHasNotSpoken] = (0, react_1.useState)(false);
    const [answers, setAnswers] = (0, react_1.useState)([]);
    const [answer, setAnswer] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [endOfSpeech, setEndOfSpeech] = (0, react_1.useState)(false);
    const recognizerRef = (0, react_1.useRef)(null);
    // is Local
    const isLocal = "development";
    const { token, region } = (0, VoxProvider_1.useToken)();
    console.log(token, region, "yes");
    const debounced = (0, use_debounce_1.useDebouncedCallback)((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    const [config, setConfig] = (0, react_1.useState)(null);
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
    (0, react_1.useEffect)(() => {
        var _a;
        if (endOfSpeech && !userHasNotSpoken) {
            isLocal && console.log("closing speech - useEffect");
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
        }
    }, [endOfSpeech]);
    const stopSpeechRecognition = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _b, _c;
        (_b = recognizerRef.current) === null || _b === void 0 ? void 0 : _b.stopContinuousRecognitionAsync();
        setLoading(false);
        isLocal && console.log("closing speech - stopSpeechRecognition");
        (_c = recognizerRef.current) === null || _c === void 0 ? void 0 : _c.close();
        recognizerRef.current = null;
        setAnswers([]);
        setAnswer("");
    });
    (0, react_1.useEffect)(() => {
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
exports.default = useListen;
//# sourceMappingURL=useListen.js.map