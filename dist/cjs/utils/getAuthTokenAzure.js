"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("../api/axios"));
function getAuthTokenAzure() {
    let token = null;
    let region = null;
    let lastCall = 0;
    return () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (token && region) {
            // check last call was less than 10 minutes ago
            if (Date.now() - lastCall < 10 * 60 * 1000) {
                return { token, region };
            }
        }
        const response = yield axios_1.default.get('/token');
        const { token: t, region: r } = response.data;
        token = t;
        region = r;
        lastCall = Date.now();
        return { token, region };
    });
}
exports.default = getAuthTokenAzure;
//# sourceMappingURL=getAuthTokenAzure.js.map