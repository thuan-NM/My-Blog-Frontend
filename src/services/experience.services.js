import createApiClient from "./api";

class ExperienceServices {
    constructor(baseURL = `/experiences`) {
        this.api = createApiClient(baseURL);
    }
    async getExperiencesWithUserId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postExperience(data) {
        return (await this.api.post("/",data)).data;
    }
    async updateExperienceWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async deleteExperience(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ExperienceServices();
