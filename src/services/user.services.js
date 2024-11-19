import createApiClient from "./api";

class UserServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/users`) {
        this.api = createApiClient(baseURL);
    }
    async getUsersList() {
        return (await this.api.get("/")).data;
    }
    async getUsersWithSearch(searchTerm) {
        return (await this.api.get(`/search`, { params: { searchTerm } })).data;
    }
    async getUsersWithId(id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.get(`/${id}`, { headers })).data;
    }
    async updateUserWithId(data, id) {
        return (await this.api.put(`/${id}`, data)).data;
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
export default new UserServices();