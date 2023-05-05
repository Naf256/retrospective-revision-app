import express from 'express';
import cors from 'cors';
import taskRouter from './routes/taskRoute';
import userRouter from './routes/userRoute';
import { tokenExtractor } from './utils/middleware';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static('dist'));

app.use('/api/task', tokenExtractor, taskRouter);

app.use('/api/user', userRouter);



app.listen(3003, () => {
	console.log(`server listening to port: 3003`);
});
