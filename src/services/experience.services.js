import createApiClient from "./api";

class ExperienceServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/experiences`) {
        this.api = createApiClient(baseURL);
    }
    async getExperiencesWithUserId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postExperience(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post("/",data,{headers})).data;
    }
    async updateExperienceWithId(data,id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.put(`/${id}`,data,{headers})).data;
    }
    async deleteExperience(id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.delete(`/${id}`,{headers})).data;
    }
}
export default new ExperienceServices();
