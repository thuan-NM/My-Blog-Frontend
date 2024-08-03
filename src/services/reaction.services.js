import createApiClient from "./api";

class ReactionServices {
    constructor(baseURL = `/reactions`) {
        this.api = createApiClient(baseURL);
    }
    async getReactionsWithPostId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postReaction(data,id) {
        return (await this.api.post(`/${id}`,data)).data;
    }
}
export default new ReactionServices();
