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
    async requestConfirmation(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        return (await this.api.post(`/sendrequest`, data, { headers })).data;
    }

    // New method for confirming an interview
    async confirmRequest(token) {
        return (await this.api.get(`/confirmInterview/${token}`)).data;
    }
    async getInterviewCandidates(companyId) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.get(`/interviewcandidates/${companyId}`)).data;
    }
    async scheduleInterview(data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/schedule`, data, { headers })).data;
    }

    async acceptInterview(jobStatusId) {
        return (await this.api.get(`/interview/accept/${jobStatusId}`)).data;
    }

    async rescheduleInterview(jobStatusId, data) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        return (await this.api.post(`/interview/reschedule/${jobStatusId}`, data, { headers })).data;
    }
    async getJobstatusDetails(jobStatusId) {
        return (await this.api.get(`/details/${jobStatusId}`)).data;
    }
    async getInterviewConfirmedCandidates(companyId) {
        return (await this.api.get(`/interview-confirmed/${companyId}`));
    };

}

export default new JobstatusServices();