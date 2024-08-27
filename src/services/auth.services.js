import createApiClient from "./api";

class AuthServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/auth`) {
        this.api = createApiClient(baseURL);
    }
    async signIn(data) {
        return (await this.api.post("/login", data)).data;
    }
    async signInWithGoogle(data) {
        return (await this.api.post("/loginwithgoogle", {id:data})).data;
    }
    async signUp(data) {
        return (await this.api.post("/register", data)).data;
    }
    async changePassword(data) {
        return (await this.api.put("/changepassword/:id", data)).data;
    }
}
export default new AuthServices();
