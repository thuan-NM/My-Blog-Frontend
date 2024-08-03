import createApiClient from "./api";

class CommentServices {
    constructor(baseURL = process.env.REACT_APP_API_URL+`/comments`) {
        this.api = createApiClient(baseURL);
    }
    async getCommentsList() {
        return (await this.api.get("/")).data;
    }
    async getCommentsWithPostId(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async postComment(data) {
        return (await this.api.post("/",data)).data;
    }
    async updateCommentWithId(data,id) {
        return (await this.api.put(`/${id}`,data)).data;
    }
    async deleteComment(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new CommentServices();
