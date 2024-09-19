import createApiClient from "./api";

class OverviewServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/overviews`) {
        this.api = createApiClient(baseURL);
    }

    // Get overview by User ID
    async getOverviewWithUserID(id) {
        return (await this.api.get(`/user/${id}`)).data;
    }

    // Get overview by Company ID
    async getOverviewWithCompanyID(id) {
        return (await this.api.get(`/company/${id}`)).data;
    }

    // Create or update overview for User
    async postUserOverview(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/user`, data, { headers })).data;
    }

    // Create or update overview for Company
    async postCompanyOverview(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/company`, data, { headers })).data;
    }
}

export default new OverviewServices();
