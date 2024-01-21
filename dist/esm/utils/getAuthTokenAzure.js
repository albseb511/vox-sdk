import { __awaiter } from "tslib";
import api from "../api/axios";
export default function getAuthTokenAzure() {
    let token = null;
    let region = null;
    let lastCall = 0;
    return () => __awaiter(this, void 0, void 0, function* () {
        if (token && region) {
            // check last call was less than 10 minutes ago
            if (Date.now() - lastCall < 10 * 60 * 1000) {
                return { token, region };
            }
        }
        const response = yield api.get('/token');
        const { token: t, region: r } = response.data;
        token = t;
        region = r;
        lastCall = Date.now();
        return { token, region };
    });
}
//# sourceMappingURL=getAuthTokenAzure.js.map