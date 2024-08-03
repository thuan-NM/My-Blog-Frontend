import createApiClient from "./api";

class AuthServices {
    constructor(baseURL = `/auth`) {
        this.api = createApiClient(baseURL);
    }
    async signIn(data) {
        return (await this.api.post("/login", data)).data;
    }
    async signUp(data) {
        return (await this.api.post("/register", data)).data;
    }
    async changePassword(data) {
        return (await this.api.put("/changepassword/:id", data)).data;
    }
}
export default new AuthServices();
