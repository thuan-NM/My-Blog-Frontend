import createApiClient from "./api";

class JobstatusServices {
    constructor(baseURL = `/jobstatus`) {
        this.api = createApiClient(baseURL);
    }
    async getJobstatusList() {
        return (await this.api.get("/")).data;
    }
    async getJobsApplied() {
        return (await this.api.get("/applied")).data;
    }
    async getUsersAppliedJob() {
        return (await this.api.get("/checkUserApplied")).data
    }
    async getJobstatusWithUserId(id) {
        return (await this.api.get(`/${id}`)).data
    }
    async postJobstatus(data) {
        return (await this.api.post(`/`,data)).data
    }
    async hireWithUserId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async denyWithUserId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async updateJobstatusWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async deleteJobstatusWithID(id){
        return (await this.api.delete(`/${id}`))
    }
}
export default new JobstatusServices();
