"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ENVIRONMENT = exports.ENVIRONMENT_TYPE = exports.REFETCH_TOKEN_TIME = void 0;
exports.REFETCH_TOKEN_TIME = 10 * 60 * 1000;
var ENVIRONMENT_TYPE;
(function (ENVIRONMENT_TYPE) {
    ENVIRONMENT_TYPE["DEV"] = "development";
    ENVIRONMENT_TYPE["PROD"] = "production";
})(ENVIRONMENT_TYPE || (exports.ENVIRONMENT_TYPE = ENVIRONMENT_TYPE = {}));
exports.APP_ENVIRONMENT = ENVIRONMENT_TYPE.DEV;
//# sourceMappingURL=constant.utils.js.map