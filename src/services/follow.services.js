import createApiClient from "./api";

class FollowServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/follow`) {
        this.api = createApiClient(baseURL);
    }

    async followUser(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/follow`, data, { headers })).data;
    }

    async unfollowUser(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/unfollow`, data, { headers })).data;
    }

    async getFollowers(userId) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.get(`/followers/${userId}`, { headers })).data;
    }

    async getFollowing(userId) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.get(`/following/${userId}`, { headers })).data;
    }
}

export default new FollowServices();