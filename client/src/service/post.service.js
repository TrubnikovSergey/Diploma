import httpService from "../service/http.service"
import config from "../config"

const url = config.backendEndPoint + "posts"

const postService = {
    async fetchAll() {
        const { data } = await httpService.get(url)

        return data
    },
    async fetchPaginateWithSearch(search) {
        const { data } = await httpService.post(url + "/search", search)

        return data
    },
    async fetchPaginate(reqBody) {
        const { data } = await httpService.post(url + "/paginate", reqBody)

        return data
    },
    async getPostById(id) {
        const { data } = await httpService.get(`${url}/${id}`)

        return data
    },
    async create(post, accessToken, refreshToken) {
        const { data } = await httpService.post(`${url}/new`, post, {
            headers: { authorization: `Bearer ${accessToken} ${refreshToken}` }
        })
        return data
    },
    async update(post, accessToken, refreshToken) {
        const { data } = await httpService.patch(`${url}/${post._id}`, post, {
            headers: { authorization: `Bearer ${accessToken} ${refreshToken}` }
        })
        return data
    },

    async delete(postId, accessToken, refreshToken) {
        const { data } = await httpService.delete(`${url}/${postId}`, {
            headers: { authorization: `Bearer ${accessToken} ${refreshToken}` }
        })
        return data
    }
}

export default postService
