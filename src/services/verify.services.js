import createApiClient from "./api";

class VerifyServices {
    constructor(baseURL = process.env.REACT_APP_API_URL) {
        this.api = createApiClient(baseURL);
    }
    async verifyEmail(route, token) {
        return (await this.api.get(`/${route}/verify-email?token=${token}`)).data;
    }
}
export default new VerifyServices();