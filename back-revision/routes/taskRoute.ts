/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const taskRouter = express.Router();

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.get('/', async (req, res) => {

	if ('token' in req) {
		const token = req.token as string;
		// eslint-disable-next-line @typescript-eslint/await-thenable
		const decoded = await jwt.verify(token, 'secret');

		if (typeof decoded !== 'string') {

			const f = new Intl.DateTimeFormat("en-bn", {
				dateStyle: "full"
			});

			const d = new Date();

			const today = await prisma.task.findMany({
				where: {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					creatorId: decoded.id,
					creation_date: f.format(d)
				},
				select: {
					id: true,
					name: true,
				}
			});

			const revision = await prisma.task.findMany({
				where: {
					creatorId: decoded.id,
					revision_dates: {
						has: f.format(d)
					}
				},
				select: {
					id: true,
					name: true,
				}
			});

			return res.status(200).json({
				today,
				revision
			});
		}

	} 

	return res.status(400).json({
		error: 'something wrong with the auth'
	});

});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.post('/', async (req, res) => {
	const name = req.body.name as string;
	const id = req.body.id as string;

	if ('token' in req) {
		const token = req.token as string;
		const decoded = jwt.verify(token, 'secret');

		const f = new Intl.DateTimeFormat("en-bn", {
			dateStyle: "full"
		});

		const today = new Date();
		const seven = new Date();
		const fourteen = new Date();
		const tweentyOne = new Date();
		const thirty = new Date();

		const arr = [
			f.format(seven.setDate(today.getDate() + 7)),
			f.format(fourteen.setDate(today.getDate() + 14)),
			f.format(tweentyOne.setDate(today.getDate() + 21)),
			f.format(thirty.setDate(today.getDate() + 30))
		];

		if (typeof decoded !== 'string') {
			const task = await prisma.task.create({
				data: {
					creator: {
						connect: {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							id: decoded.id,
						}
					},
					id: id,
					name: name,
					creation_date: f.format(today),
					revision_dates: [...arr]
				},
				select: {
					id: true,
					name: true,
				}
			});

			return res.status(201).json(task);
		}

	}

	return res.status(400).json({
		error: 'cannot create the task'
	});

});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.delete('/:id', async (req, res) => {
	const id = req.params.id;

	const deletedTask = await prisma.task.delete({
		where: {
			id: id
		},
		select: {
			name: true
		}
	});

	if (deletedTask.name) {
		return res.status(204).json({
			message: 'task is deleted',
			name: deletedTask.name
		});
	}

	return res.status(400).send('deletion error');
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.put('/:id', async (req, res) => {
	const name = req.body.name;
	const id = req.params.id;

	const updatedTask = await prisma.task.update({
		where: {
			id: id
		},
		data: {
			name: name
		},
		select: {
			id: true,
			name: true,
		}
	});

	return res.status(200).json(updatedTask);
});

export default taskRouter;
