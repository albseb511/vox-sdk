import api from "../api/axios";

export default function getAuthTokenAzure() {
    let token : null | string = null;
    let region : null | string = null;
    let lastCall = 0
    return async ()=>{
        if(token && region) {
            // check last call was less than 10 minutes ago
            if(Date.now() - lastCall < 10 * 60 * 1000) {
                return { token, region }
            }
        }
        const response = await api.get('/token')
        const { token:t, region:r } = response.data as { token: string; region: string }
        token = t
        region = r
        lastCall = Date.now()
        return { token, region }
    }
}
