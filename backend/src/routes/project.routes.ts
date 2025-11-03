import express from 'express';
import { createProject, getAllProjects, removeMember, updateMember } from '../controller/project-controller';
import { authMiddleware } from '../middleware/authMiddleware';

const projectrouter = express.Router();

projectrouter.post('/create', authMiddleware, createProject);
projectrouter.get('/my-projects',authMiddleware ,getAllProjects);
projectrouter.put('/:id/add-member',authMiddleware , updateMember);
projectrouter.patch("/:id/members/remove", authMiddleware, removeMember);


export default projectrouter;