"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//
// For more samples please visit https://github.com/Azure-Samples/cognitive-services-speech-sdk
//
const sdk = tslib_1.__importStar(require("microsoft-cognitiveservices-speech-sdk"));
const react_1 = tslib_1.__importStar(require("react"));
const getAuthTokenAzure_1 = tslib_1.__importDefault(require("../utils/getAuthTokenAzure"));
// import react-toastify
const use_debounce_1 = require("use-debounce");
function useTTSwithAI({ shouldCallOnEnd = false, onEnd, }) {
    const [isSpeaking, setIsSpeaking] = (0, react_1.useState)(false);
    const [hasAllSentencesBeenSpoken, setHasAllSentencesBeenSpoken] = (0, react_1.useState)(true);
    const [_currentStreamedSentence, setCurrentStreamedSentence] = (0, react_1.useState)("");
    const [streamedSentences, setStreamedSentences] = (0, react_1.useState)([]);
    const [config, setConfig] = (0, react_1.useState)(null);
    const didStreamCallbackGetCalled = (0, react_1.useRef)(false);
    const playerRef = react_1.default.useRef(null);
    const audioConfig = react_1.default.useRef(null);
    const speechSythesizerRef = react_1.default.useRef(null);
    const voice = "en-US-JennyNeural";
    const getAuthTokenAzureApi = (0, react_1.useRef)((0, getAuthTokenAzure_1.default)());
    const throttledCalledback = (0, use_debounce_1.useThrottledCallback)((text) => startTextToSpeech(text), 100);
    const isLocal = process.env.NODE_ENV === "development";
    const startTextToSpeech = (text, _cancelEndCallback) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (isSpeaking)
            Promise.reject("Already speaking");
        // Creates an audio instance.
        if ((_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.id) {
            (_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.pause();
            (_c = playerRef.current) === null || _c === void 0 ? void 0 : _c.close();
            (_d = audioConfig.current) === null || _d === void 0 ? void 0 : _d.close();
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
            const { token, region } = (_e = (yield getAuthTokenAzureApi.current())) !== null && _e !== void 0 ? _e : {};
            if (!token || !region)
                Promise.reject(`Error getting token or region`);
            setConfig({ t: token, r: region });
            const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
            speechConfig.speechSynthesisVoiceName = voice;
            speechSythesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig.current);
        }
        else {
            const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config === null || config === void 0 ? void 0 : config.t, config === null || config === void 0 ? void 0 : config.r);
            speechConfig.speechSynthesisVoiceName = voice;
            speechSythesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig.current);
        }
        // Receives a text from console input and synthesizes it to speaker.
        try {
            speechSythesizerRef.current.speakTextAsync(text, (result) => {
                var _a, _b;
                if (result) {
                    // debug statement with description
                    (_a = speechSythesizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
                    (_b = audioConfig.current) === null || _b === void 0 ? void 0 : _b.close();
                    speechSythesizerRef.current = null;
                    return result.audioData;
                }
                // Explicitly return null or undefined when there's no result
                return null; // or undefined
            }, (error) => {
                var _a, _b;
                isLocal && console.log(error);
                (_a = speechSythesizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
                (_b = audioConfig.current) === null || _b === void 0 ? void 0 : _b.close();
                speechSythesizerRef.current = null;
            });
            speechSythesizerRef.current.synthesisStarted = () => {
                // debug statement
                setIsSpeaking(true);
            };
        }
        catch (err) {
            console.log(`error`);
        }
        return () => {
            var _a, _b, _c, _d;
            isLocal && console.log(`closing player`);
            (_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.pause();
            (_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.close();
            (_c = audioConfig.current) === null || _c === void 0 ? void 0 : _c.close();
            playerRef.current = null;
            (_d = speechSythesizerRef.current) === null || _d === void 0 ? void 0 : _d.close();
            speechSythesizerRef.current = null;
        };
    });
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        getAuthTokenAzureApi.current().then(({ token, region }) => {
            if (!token || !region)
                isLocal && console.log(`Error getting token or region`);
            setConfig({ t: token, r: region });
        });
        return () => {
            var _a, _b, _c, _d;
            isLocal && console.log(`closing player`);
            (_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.pause();
            (_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.close();
            (_c = audioConfig.current) === null || _c === void 0 ? void 0 : _c.close();
            playerRef.current = null;
            (_d = speechSythesizerRef.current) === null || _d === void 0 ? void 0 : _d.close();
            speechSythesizerRef.current = null;
        };
    }, []);
    const interruptSpeech = () => {
        var _a, _b, _c, _d;
        isLocal && console.log(`interrupting speech`);
        (_a = speechSythesizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
        speechSythesizerRef.current = null;
        (_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.pause();
        (_c = playerRef.current) === null || _c === void 0 ? void 0 : _c.close();
        (_d = audioConfig.current) === null || _d === void 0 ? void 0 : _d.close();
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
exports.default = useTTSwithAI;
//# sourceMappingURL=useSpeak.js.map