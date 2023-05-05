import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userRouter = express.Router();

interface User {
	id: string,
	username: string,
	password: string
}

interface LoginParam {
	username: string,
	password: string
}

// handles logging in the user
// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.post('/login', async (req, res) => {
	const { username, password } = req.body as LoginParam;
	
	const user: User | null = await prisma.user.findUnique({
		where: {
			username: username
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const passwordCorrect = user === null
		? false
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		: password === user.password;

	if (passwordCorrect && user) {

		const userForToken = {
			username: user.username,
			id: user.id
		};

		const token = jwt.sign(userForToken, 'secret');

		return res.json({
			token: token,
			username: user.username,
			id: user.id
		});
	}

	return res.json('username/password is incorrect');
});

// creating a new user
// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.post('/', async (req, res) => {
	const { username, password } = req.body as LoginParam;

	const user: User | null = await prisma.user.findFirst({
		where: {
			username: username
		}
	});

	if (user) {
		return res.json('try a different username, it already exists');
	}


	const newUser: User | null = await prisma.user.create({
		data: {
			username: username,
			password: password
		}
	});

	if (newUser) {

		const userForToken = {
			username: newUser.username,
			id: newUser.id
		};

		const token = jwt.sign(userForToken, 'secret');

		return res.status(201).json({
			token: token,
			username: newUser.username,
			id: newUser.id
		});
	}

	return res.json('something went wrong');
});

// deletes a user from the database
// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.delete('/:id', async (req, res) => {
	const paramId = req.params.id;

	const deletedUser = await prisma.user.delete({
			where: {
				id: paramId
			},
			select: {
				id: true
			}
	});

	if (deletedUser.id) {
		return res.status(204).send('successfully deleted');
	}

	return res.status(400).send('something went wrong');


});

export default userRouter;
