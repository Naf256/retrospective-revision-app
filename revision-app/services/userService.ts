import axios from 'axios'

const baseUrl = 'render-test-hpmo.onrender.com/api/user'

const login = async (obj: object) => {
	const response = await axios.post(`${baseUrl}/login`, obj)
	
	return response.data
}

const create = async (obj: object) => {
	const response = await axios.post(baseUrl, obj)

	return response.data
}

export default {
	login,
	create
}
