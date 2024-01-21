"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSpeak = exports.useToken = exports.useAppContext = exports.useListen = exports.VoxProvider = void 0;
const tslib_1 = require("tslib");
const VoxProvider_1 = require("./context/VoxProvider");
Object.defineProperty(exports, "VoxProvider", { enumerable: true, get: function () { return VoxProvider_1.VoxProvider; } });
Object.defineProperty(exports, "useAppContext", { enumerable: true, get: function () { return VoxProvider_1.useAppContext; } });
Object.defineProperty(exports, "useToken", { enumerable: true, get: function () { return VoxProvider_1.useToken; } });
const useListen_1 = tslib_1.__importDefault(require("./hooks/useListen"));
exports.useListen = useListen_1.default;
const useSpeak_1 = tslib_1.__importDefault(require("./hooks/useSpeak"));
exports.useSpeak = useSpeak_1.default;
//# sourceMappingURL=index.js.map