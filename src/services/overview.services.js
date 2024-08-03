import createApiClient from "./api";

class OverviewServices {
    constructor(baseURL = `/overviews`) {
        this.api = createApiClient(baseURL);
    }
    async getOverviewWithUserID(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postOverview(data) {
        return (await this.api.post(`/`,data)).data;
    }
}
export default new OverviewServices();
