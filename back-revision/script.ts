import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {


	const revisionTasks = await prisma.task.findMany({
		where: {
			creatorId: '643660d0ec556c3a263e55f1',
			revision_dates: {
				has: 'Thursday, April 20, 2023'
			}
		}	
	});



	const today = new Date();


	const f = new Intl.DateTimeFormat("en-bn", {
		dateStyle: "full"
	});


	console.log(f.format(today));


	const todayTasks = await prisma.task.findMany({
		where: {
			creatorId: '643660d0ec556c3a263e55f1',
			creation_date: f.format(today) 
		}
	});

	const tasks = {
		todayTasks,
		revisionTasks
	};

	console.log(tasks);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async () => {
		console.log('something went wrong');
		await prisma.$disconnect();
	});
