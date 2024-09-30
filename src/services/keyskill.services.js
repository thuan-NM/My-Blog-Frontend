import createApiClient from "./api";

class KeySkillServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/keyskills`) {
        this.api = createApiClient(baseURL);
    }

    // Get key skills by Company ID
    async getKeySkillsWithCompanyID(id) {
        return (await this.api.get(`/company/${id}`)).data;
    }

    // Create or update key skills for Company
    async postCompanyKeySkills(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/company`, data, { headers })).data;
    }
}

export default new KeySkillServices();
