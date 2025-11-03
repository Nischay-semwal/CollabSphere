import express from 'express'
import { createTask, getAllTask ,updateTask ,deleteTask, addMemberToTask, removeMember} from '../controller/task-controller';
import { authMiddleware } from '../middleware/authMiddleware';

const taskrouter = express.Router();

taskrouter.post('/',authMiddleware,createTask);
taskrouter.get('/:id',authMiddleware,getAllTask);
taskrouter.put('/:id',authMiddleware,updateTask);
taskrouter.delete('/:id',authMiddleware ,deleteTask);

taskrouter.post('/:id/add-member',authMiddleware , addMemberToTask);
taskrouter.delete('/:id/remove-member',authMiddleware , removeMember);

export default taskrouter;