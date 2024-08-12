import createApiClient from "./api";

class EducationServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/educations`) {
        this.api = createApiClient(baseURL);
    }
    async getEducationsWithUserId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postEducation(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post("/", data,{ headers })).data;
    }
    async updateEducationWithId(data, id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.put(`/${id}`, data,{headers})).data;
    }
    async deleteEducation(id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.delete(`/${id}`,{ headers })).data;
    }
}
export default new EducationServices();
