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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useDebouncedCallback } from "use-debounce";
import { useToken } from "../context/VoxProvider";
function useListen(_a) {
    var _this = this;
    var onEndOfSpeech = _a.onEndOfSpeech, isAiSpeaking = _a.isAiSpeaking, _b = _a.automatedEnd, automatedEnd = _b === void 0 ? true : _b, _c = _a.delay, delay = _c === void 0 ? 2000 : _c;
    var _d = useState(false), userHasNotSpoken = _d[0], setUserHasNotSpoken = _d[1];
    var _e = useState([]), answers = _e[0], setAnswers = _e[1];
    var _f = useState(""), answer = _f[0], setAnswer = _f[1];
    var _g = useState(false), loading = _g[0], setLoading = _g[1];
    var _h = useState(false), endOfSpeech = _h[0], setEndOfSpeech = _h[1];
    var recognizerRef = useRef(null);
    // is Local
    var isLocal = "development";
    var _j = useToken(), token = _j.token, region = _j.region;
    var debounced = useDebouncedCallback(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!automatedEnd)
                        return [2 /*return*/];
                    setEndOfSpeech(true);
                    setLoading(false);
                    if (!userHasNotSpoken) {
                        isLocal && console.log("closing speech - debounced");
                        (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
                        recognizerRef.current = null;
                    }
                    isLocal && console.log("----- end of speech ------");
                    if (!onEndOfSpeech) return [3 /*break*/, 2];
                    return [4 /*yield*/, onEndOfSpeech()];
                case 1:
                    _b.sent();
                    resolve && resolve(answers);
                    setAnswers([]);
                    setAnswer("");
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, delay);
    var _k = useState(null), config = _k[0], setConfig = _k[1];
    var startSpeechRecognition = function () {
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var audioConfig, speechConfig, speechConfig;
            return __generator(this, function (_a) {
                if (recognizerRef.current) {
                    recognizerRef.current.close();
                    recognizerRef.current = null;
                }
                audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
                if (!config) {
                    if (!token || !region)
                        return [2 /*return*/, isLocal && console.log("Error getting token or region")];
                    setConfig({ t: token, r: region });
                    speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
                    speechConfig.speechRecognitionLanguage = "en-US";
                    recognizerRef.current = new sdk.SpeechRecognizer(speechConfig, audioConfig);
                }
                else {
                    speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config === null || config === void 0 ? void 0 : config.t, config === null || config === void 0 ? void 0 : config.r);
                    speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
                    recognizerRef.current = new sdk.SpeechRecognizer(speechConfig, audioConfig);
                }
                // debug statement
                isLocal && console.log("starting to recognise");
                setLoading(true);
                recognizerRef.current.recognizing = function (s, e) {
                    isLocal && console.log("RECOGNIZING: Text=".concat(e.result.text));
                    if (isAiSpeaking)
                        return;
                    setAnswer(e.result.text);
                    debounced(resolve);
                };
                recognizerRef.current.recognized = function (s, e) {
                    if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
                        isLocal && console.log("RECOGNIZED: Text=".concat(e.result.text));
                        if (isAiSpeaking)
                            return;
                        setAnswers(function (prev) { return __spreadArray(__spreadArray([], prev, true), [e.result.text], false); });
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
                recognizerRef.current.canceled = function (s, e) {
                    var _a;
                    isLocal && console.log("CANCELED: Reason=".concat(e.reason));
                    if (e.reason == sdk.CancellationReason.Error) {
                        isLocal && console.log("\"CANCELED: ErrorCode=".concat(e.errorCode));
                        isLocal && console.log("\"CANCELED: ErrorDetails=".concat(e.errorDetails));
                        isLocal &&
                            console.log("CANCELED: Did you set the speech resource key and region values?");
                    }
                    (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.stopContinuousRecognitionAsync();
                };
                recognizerRef.current.sessionStopped = function (s, e) {
                    var _a;
                    isLocal && console.log("\n    Session stopped event.");
                    (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.stopContinuousRecognitionAsync();
                };
                recognizerRef.current.startContinuousRecognitionAsync(function () {
                    // debug statement
                    isLocal && console.log("Start of speech");
                }, function (err) {
                    var _a;
                    window.console.log(err);
                    isLocal && console.log("closing speech - error");
                    (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
                    setLoading(false);
                });
                return [2 /*return*/];
            });
        }); });
    };
    useEffect(function () {
        var _a;
        if (endOfSpeech && !userHasNotSpoken) {
            isLocal && console.log("closing speech - useEffect");
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.close();
        }
    }, [endOfSpeech]);
    var stopSpeechRecognition = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            (_a = recognizerRef.current) === null || _a === void 0 ? void 0 : _a.stopContinuousRecognitionAsync();
            setLoading(false);
            isLocal && console.log("closing speech - stopSpeechRecognition");
            (_b = recognizerRef.current) === null || _b === void 0 ? void 0 : _b.close();
            recognizerRef.current = null;
            setAnswers([]);
            setAnswer("");
            return [2 /*return*/];
        });
    }); };
    useEffect(function () {
        return function () {
            isLocal && console.log("closing speech - UEH-END");
            stopSpeechRecognition();
        };
    }, []);
    return {
        answer: answer,
        answers: answers,
        loading: loading,
        startSpeechRecognition: startSpeechRecognition,
        stopSpeechRecognition: stopSpeechRecognition,
        recognizerRef: recognizerRef,
    };
}
export default useListen;
