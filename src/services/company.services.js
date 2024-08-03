import createApiClient from "./api";

class CompanyServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/companies`) {
        this.api = createApiClient(baseURL);
    }
    async getCompaniesList() {
        return (await this.api.get("/")).data;
    }
    async getCompaniesWithSearch() {
        return (await this.api.get("/search")).data;
    }
    async getCompanyWithId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async updateCompanyWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
}
export default new CompanyServices();
