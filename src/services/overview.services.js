import createApiClient from "./api";

class OverviewServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/overviews`) {
        this.api = createApiClient(baseURL);
    }
    async getOverviewWithUserID(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postOverview(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/`,data,{headers})).data;
    }
}
export default new OverviewServices();
