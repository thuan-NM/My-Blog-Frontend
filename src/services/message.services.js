import createApiClient from "./api";

class MessageServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/messages`) {
        this.api = createApiClient(baseURL);
    }
    async getRecentMessage(roomId) {
        return (await this.api.get(`/${roomId}/recent`)).data;
    }

    // Search for messages in a room based on a search term
    async searchMessages(roomId, searchTerm) {
        return (await this.api.get(`/${roomId}/search`, {
            params: { searchTerm }
        })).data;
    }
    async getMessage(roomId) {
        return (await this.api.get(`/${roomId}`, {
        })).data;
    }
}
export default new MessageServices();