import createApiClient from "./api";

class ReactionServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/reactions`) {
        this.api = createApiClient(baseURL);
    }
    async getReactionsWithPostId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postReaction(data, id) {
        return (await this.api.post(`/${id}`, { userId: data })).data;
    }
}
export default new ReactionServices();