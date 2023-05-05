export interface Task {
    id: string,
    name: string
}

export interface User {
	token: string,
	username: string,
	id: string
}

export interface AppState {
	user: User
}

export {}
