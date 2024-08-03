import createApiClient from "./api";

class CompanyAuthServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/companyauth`) {
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
export default new CompanyAuthServices();
