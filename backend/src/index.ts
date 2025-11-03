import express from 'express'
import { connectToDb } from './database/db';
import { PORT } from './config/config';
import authRoute from './routes/auth.routes';
import projectRoute from './routes/project.routes';
import taskRoute from './routes/task.routes';

connectToDb();
const app = express();


app.use(express.json());

app.use('/api/auth' , authRoute);
app.use('/api/projects',projectRoute);
app.use('/api/tasks',taskRoute);

app.listen(PORT , ()=>{
    console.log(`Server is running on Port ${PORT}`); 
})