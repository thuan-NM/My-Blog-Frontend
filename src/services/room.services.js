import createApiClient from "./api";

class RoomServices {
    constructor(baseURL = process.env.REACT_APP_API_ROOM_APP_API_URL + `/rooms`) {
        this.api = createApiClient(baseURL);
    }

    async createRoom(data) {
        // Gửi request POST tới endpoint để tạo phòng
        return (await this.api.post(`/create`, data));
    }

    async joinRoom(roomId, data) {
        // Gửi request POST tới endpoint để join vào phòng theo roomId
        return (await this.api.post(`/join/${roomId}`, data)).data;
    }

    async leaveRoom(roomId, data) {
        // Gửi request POST tới endpoint để rời khỏi phòng theo roomId
        return (await this.api.post(`/leave/${roomId}`, data)).data;
    }

    async getRoom(roomId) {
        // Gửi request GET tới endpoint để lấy thông tin phòng theo roomId
        return (await this.api.get(`/${roomId}`)).data;
    }
}

export default new RoomServices();