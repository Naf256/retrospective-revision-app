import axios from 'axios'

const baseUrl = 'render-test-hpmo.onrender.com/api/task'


const getAll = async (token: any) => {
	const config = {
		headers: { Authorization: `bearer ${token}` }
	}

	const response = await axios.get(baseUrl, config)

	return response.data
}

const create = async (credentials: object, token: string) => {
	const config = {
		headers: { Authorization: `bearer ${token}` }
	}

	const response = await axios.post(baseUrl, credentials, config)
	
	return response.data
}

const change = async (id: string, name: string) => {
	const response = await axios.put(`${baseUrl}/${id}`, { name })

	return response.data
}

const remove = async (id: string) => {
	const response = await axios.delete(`${baseUrl}/${id}`)

	return response.data
}

export default {
	getAll,
	create,
	change,
	remove
}
