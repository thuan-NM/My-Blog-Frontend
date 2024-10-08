import createApiClient from "./api";

class JobstatusServices {
    constructor(baseURL = process.env.REACT_APP_API_URL + `/jobstatus`) {
        this.api = createApiClient(baseURL);
    }

    async getJobstatusList() {
        return (await this.api.get("/")).data;
    }

    async getJobsApplied(params) {
        return (await this.api.get("/applied", { params })).data;
    }

    async getUsersAppliedJob(data) {
        return (await this.api.get(`/checkUserApplied`, { params: data })).data;
    }

    async getJobstatusWithAuthorId(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async postJobstatus(data, header) {
        return (await this.api.post(`/`, data, header)).data;
    }

    async getCandidateOfJob(id) {
        return (await this.api.get(`/candidate/${id}`)).data;
    }

    async hireWithUserId(data, id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        return (await this.api.put(`/hire/${id}`, data, { headers })).data;
    }

    async denyWithUserId(data, id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        return (await this.api.put(`/deny/${id}`, data, { headers })).data;
    }

    async updateJobstatusWithId(data, id) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteJobstatusWithID(id) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        return (await this.api.delete(`/${id}`, { headers }));
    }

    // New method for scheduling an interview
    async scheduleInterview(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        return (await this.api.post(`/scheduleInterview`, data, { headers })).data;
    }

    // New method for confirming an interview
    async confirmInterview(token) {
        return (await this.api.get(`/confirmInterview/${token}`)).data;
    }
}

export default new JobstatusServices();