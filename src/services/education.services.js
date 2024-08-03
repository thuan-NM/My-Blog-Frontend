import createApiClient from "./api";

class ExperienceServices {
    constructor(baseURL = `/educations`) {
        this.api = createApiClient(baseURL);
    }
    async getEducationsWithUserId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postEducation(data) {
        return (await this.api.post("/",data)).data;
    }
    async updateEducationWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async deleteEducation(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ExperienceServices();
