import createApiClient from "./api";

class PostServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/posts`) {
        this.api = createApiClient(baseURL);
    }
    async getJobsList() {
        return (await this.api.get("/")).data;
    }
    async getJobsWithSearch() {
        return (await this.api.get("/search")).data;
    }
    async getTopJobs() {
        return (await this.api.get("/topjob")).data
    }
    async getMostInterestJobs() {
        return (await this.api.get("/mostinterest")).data
    }
    async getJobsWithUser(id) {
        return (await this.api.get(`/user/${id}`)).data;
    }
    async postJob(data,header) {
        return (await this.api.post(`/`,data,header)).data
    }
    async getFilterPost(data,header) {
        return (await this.api.post(`/filter`,data,header)).data
    }
    async updatePostWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async deletePostWithID(id){
        return (await this.api.delete(`/${id}`))
    }
}
export default new PostServices();
