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
// apiContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import api, { createApi } from '../api/axios';
// Create a context
var AppContext = createContext(null);
// Provider component
export var VoxProvider = function (_a) {
    var children = _a.children, config = _a.config;
    var _b = useState(null), token = _b[0], setToken = _b[1];
    var _c = useState(null), region = _c[0], setRegion = _c[1];
    var lastCallRef = useRef(0);
    var apiRef = useRef(createApi(config === null || config === void 0 ? void 0 : config.baseUrl));
    var getAuthTokenAzure = React.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a, newToken, newRegion;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Check if token is valid and not expired
                    if (token && region && Date.now() - lastCallRef.current < 10 * 60 * 1000) {
                        return [2 /*return*/, { token: token, region: region }];
                    }
                    return [4 /*yield*/, api.get('/token')];
                case 1:
                    response = _b.sent();
                    _a = response.data, newToken = _a.token, newRegion = _a.region;
                    setToken(newToken);
                    setRegion(newRegion);
                    lastCallRef.current = Date.now();
                    return [2 /*return*/, { token: newToken, region: newRegion }];
            }
        });
    }); }, []);
    var contextValue = { getAuthTokenAzure: getAuthTokenAzure, token: token, region: region };
    return (React.createElement(AppContext.Provider, { value: contextValue }, children));
};
// Custom hook to use the context
export var useAppContext = function () {
    var context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within a VoxProvider');
    }
    return context;
};
export var useToken = function () {
    var _a = useState(true), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var _c = useAppContext(), getAuthTokenAzure = _c.getAuthTokenAzure, token = _c.token, region = _c.region;
    useEffect(function () {
        var fetchToken = function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, getAuthTokenAzure()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        setError(err_1 instanceof Error ? err_1 : new Error('Failed to fetch token'));
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchToken();
    }, [getAuthTokenAzure]);
    return { token: token, region: region, loading: loading, error: error };
};
