var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//
// For more samples please visit https://github.com/Azure-Samples/cognitive-services-speech-sdk
//
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import React, { useEffect, useRef, useState } from "react";
import getAuthTokenAzure from "../utils/getAuthTokenAzure";
// import react-toastify
import { useThrottledCallback } from "use-debounce";
function useTTSwithAI(_a) {
    var _this = this;
    var _b = _a.shouldCallOnEnd, shouldCallOnEnd = _b === void 0 ? false : _b, onEnd = _a.onEnd;
    var _c = useState(false), isStreaming = _c[0], setIsStreaming = _c[1];
    var _d = useState(false), isSpeaking = _d[0], setIsSpeaking = _d[1];
    var _e = useState(true), hasAllSentencesBeenSpoken = _e[0], setHasAllSentencesBeenSpoken = _e[1];
    var _f = useState(""), currentStreamedSentence = _f[0], setCurrentStreamedSentence = _f[1];
    var _g = useState([]), streamedSentences = _g[0], setStreamedSentences = _g[1];
    var _h = useState(null), config = _h[0], setConfig = _h[1];
    var didStreamCallbackGetCalled = useRef(false);
    var playerRef = React.useRef(null);
    var audioConfig = React.useRef(null);
    var speechSythesizerRef = React.useRef(null);
    var voice = "en-US-JennyNeural";
    var getAuthTokenAzureApi = useRef(getAuthTokenAzure());
    var throttledCalledback = useThrottledCallback(function (text) { return startTextToSpeech(text); }, 100);
    var isLocal = process.env.NODE_ENV === "development";
    var startTextToSpeech = function (text, cancelEndCallback) { return __awaiter(_this, void 0, void 0, function () {
        var player, _a, token, region, speechConfig, speechConfig;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (isSpeaking)
                        Promise.reject("Already speaking");
                    // Creates an audio instance.
                    if ((_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.id) {
                        (_c = playerRef.current) === null || _c === void 0 ? void 0 : _c.pause();
                        (_d = playerRef.current) === null || _d === void 0 ? void 0 : _d.close();
                        (_e = audioConfig.current) === null || _e === void 0 ? void 0 : _e.close();
                        playerRef.current = null;
                    }
                    player = new sdk.SpeakerAudioDestination();
                    playerRef.current = player;
                    player.onAudioEnd = function () {
                        setStreamedSentences(function (prev) {
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
                    if (!!config) return [3 /*break*/, 2];
                    return [4 /*yield*/, getAuthTokenAzureApi.current()];
                case 1:
                    _a = (_f = (_g.sent())) !== null && _f !== void 0 ? _f : {}, token = _a.token, region = _a.region;
                    if (!token || !region)
                        Promise.reject("Error getting token or region");
                    setConfig({ t: token, r: region });
                    speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
                    speechConfig.speechSynthesisVoiceName = voice;
                    speechSythesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig.current);
                    return [3 /*break*/, 3];
                case 2:
                    speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config === null || config === void 0 ? void 0 : config.t, config === null || config === void 0 ? void 0 : config.r);
                    speechConfig.speechSynthesisVoiceName = voice;
                    speechSythesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig.current);
                    _g.label = 3;
                case 3:
                    // Receives a text from console input and synthesizes it to speaker.
                    try {
                        speechSythesizerRef.current.speakTextAsync(text, function (result) {
                            var _a, _b;
                            if (result) {
                                // debug statement with description
                                (_a = speechSythesizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
                                (_b = audioConfig.current) === null || _b === void 0 ? void 0 : _b.close();
                                speechSythesizerRef.current = null;
                                return result.audioData;
                            }
                        }, function (error) {
                            var _a, _b;
                            isLocal && console.log(error);
                            (_a = speechSythesizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
                            (_b = audioConfig.current) === null || _b === void 0 ? void 0 : _b.close();
                            speechSythesizerRef.current = null;
                        });
                        speechSythesizerRef.current.synthesisStarted = function () {
                            // debug statement
                            setIsSpeaking(true);
                        };
                    }
                    catch (err) {
                        console.log("error");
                    }
                    return [2 /*return*/, function () {
                            var _a, _b, _c, _d;
                            isLocal && console.log("closing player");
                            (_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.pause();
                            (_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.close();
                            (_c = audioConfig.current) === null || _c === void 0 ? void 0 : _c.close();
                            playerRef.current = null;
                            (_d = speechSythesizerRef.current) === null || _d === void 0 ? void 0 : _d.close();
                            speechSythesizerRef.current = null;
                        }];
            }
        });
    }); };
    useEffect(function () {
        if (!isSpeaking && streamedSentences.length > 0) {
            isLocal &&
                console.log({
                    streamedSentences: streamedSentences,
                    isSpeaking: isSpeaking,
                    message: "message queue",
                });
            startTextToSpeech(streamedSentences[0]);
        }
        if (isSpeaking &&
            streamedSentences.length === 0 &&
            hasAllSentencesBeenSpoken) {
            setIsSpeaking(false);
            shouldCallOnEnd && onEnd();
        }
    }, [streamedSentences]);
    useEffect(function () {
        getAuthTokenAzureApi.current().then(function (_a) {
            var token = _a.token, region = _a.region;
            if (!token || !region)
                isLocal && console.log("Error getting token or region");
            setConfig({ t: token, r: region });
        });
        return function () {
            var _a, _b, _c, _d;
            isLocal && console.log("closing player");
            (_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.pause();
            (_b = playerRef.current) === null || _b === void 0 ? void 0 : _b.close();
            (_c = audioConfig.current) === null || _c === void 0 ? void 0 : _c.close();
            playerRef.current = null;
            (_d = speechSythesizerRef.current) === null || _d === void 0 ? void 0 : _d.close();
            speechSythesizerRef.current = null;
        };
    }, []);
    var interruptSpeech = function () {
        var _a, _b, _c, _d;
        isLocal && console.log("interrupting speech");
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
        isSpeaking: isSpeaking,
        streamedSentences: streamedSentences,
        hasAllSentencesBeenSpoken: hasAllSentencesBeenSpoken,
        speechSythesizerRef: speechSythesizerRef,
        interruptSpeech: interruptSpeech,
    };
}
export default useTTSwithAI;
