import createApiClient from "./api";

class CompanyServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/companies`) {
        this.api = createApiClient(baseURL);
    }

    async getCompaniesList() {
        return (await this.api.get("/")).data;
    }

    async getCompaniesWithSearch() {
        return (await this.api.get("/search")).data;
    }

    async getCompanyWithId(id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.get(`/${id}`, { headers })).data;
    }

    async updateCompanyWithId(data, id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.put(`/${id}`, data, { headers })).data;
    }

    async updatePictureWithId(data, id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        };
        return (await this.api.post(`/update-picture/${id}`, data, { headers })).data;
    }

    async updateCoverPictureWithId(data, id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        };
        return (await this.api.post(`/update-cover-picture/${id}`, data, { headers })).data;
    }
}

export default new CompanyServices();