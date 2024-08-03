import createApiClient from "./api";

class UserServices {
    constructor(baseURL = `/users`) {
        this.api = createApiClient(baseURL);
    }
    async getUsersList() {
        return (await this.api.get("/")).data;
    }
    async getUsersWithSearch() {
        return (await this.api.get("/search")).data;
    }
    async getUsersWithId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async updateUserWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async updatePictureWithId(data,id) {
        return (await this.api.put(`/update-picture/${id}`,data)).data;
    }
    async updateCoverPictureWithId(data,id) {
        return (await this.api.put(`/update-cover-picture/${id}`,data)).data;
    }
}
export default new UserServices();
