import Project from "../models/Project";
import Task from "../models/Task"
import type { Request ,Response} from 'express'
import User from "../models/User";
import mongoose from "mongoose";

export const createTask = async (req : Request , res : Response)=>{
   try{
       
       const {title, description, assignedTo, status ,deadline,projectId} = req.body;
   
       if(!req.user){
           return res.status(401).json({
               status : false,
               message : "Unauthorized access"
           })
       }

       if(!title || !projectId){
        return res.status(400).json({
            success : false,
            message : "Title and projectId is required"
        })
       }

       const project = await Project.findById(projectId);
       if(!project){
        return res.status(404).json({
            success : false,
            message : "Project not found"
        })
       }
       
       if(project.leader.toString() !== req.user.userId){
           return res.status(403).json({
               status : false,
               message : "Only leaders are allowed to assign task"
           })
       }
       
       if(assignedTo && !project.members.includes(assignedTo)){
        return res.status(400).json({
            success : false,
            message : "Assigned user must be part of project"
        })
       }
       const existingTask = await Task.findOne({title , project : projectId});
   
       if(existingTask){
           return res.status(400).json({
               success : false,
               message : "Task already exists"
           })
       }
   
       const newTask = await Task.create({
           title,
           description,
           assignedTo,
           status : status || "pending",
           deadline,
           project : projectId
       })
       
       return res.status(201).json({
           success : true,
           message : "Task created successfully",
           newTask
       })
   }
   catch(e){
    return res.status(500).json({
        success : false,
        message : "Internal server error"
    })
   }
}

export const getAllTask = async (req :Request , res : Response)=>{
    try{
        const projectId = req.params.id;
    
        const project = await Project.findById(projectId);
        
        if(!project){
            return res.status(404).json({
                success : false,
                message : "Project not found"
            })
        }
    
        const getTasks = await Task.find({project : projectId}).populate('assignedTo','name email')
    
        return res.status(200).json({
            success : true,
            message : "Tasks fetched successfully",
            getTasks
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export const updateTask = async (req:Request, res:Response)=>{
    try{
        const id = req.params.id;
        const {status} = req.body;
        
        const task = await Task.findById(id);
    
        if(!task){
            return res.status(404).json({
                success : false,
                message : 'Task not found'
            })
        }
        
        const project = await Project.findById(task.project);
        if(!project){
            return res.status(404).json({
                success : false,
                message : 'No project found'
            })
        }
        const userId = req.user.userId; 
        const isLeader = project.leader.toString() === userId;
        const isAssignedMember = task.assignedTo && task.assignedTo.toString() === userId; 

        if (!isLeader && !isAssignedMember) {
            return res.status(403).json({
                success: false,
                message: "Only the project leader or the assigned member can update task status",
            });
        }
        task.status = status;
        await task.save();
    
        const updatedTask = await Task.findById(task._id).populate('assignedTo','name email')
        return res.status(200).json({
            success : true,
            message : "Task updated successfully",
            task :updatedTask
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export const deleteTask = async (req:Request ,res : Response)=>{
    try{
        const {id}= req.params;
        
        if(!req.user){
            return res.status(400).json({
                success : false,
                message : "Unauthorized"
            })
        }
    
        const task = await Task.findById(id);
        if(!task){
             return res.status(404).json({
                success : false,
                message : "No task found"
            })
        }
    
        const project = await Project.findById(task.project);
        if(!project){
             return res.status(404).json({
                success : false,
                message : "No Project found"
            })
        }
    
        if(project.leader.toString() !== req.user.userId){
            return res.status(403).json({
                success : false,
                message : "Only leaders are allowed to delete task"
            })
        }
    
        await Task.findByIdAndDelete(task._id);
    
        return res.status(200).json({
            success : true,
            message : "task deleted successfully"
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export const addMemberToTask = async (req :Request , res :Response)=>{
    try{
        const taskId = req.params.id;
        const {email} =req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Please enter email"
            })
        }
        const task = await Task.findById(taskId).populate("project");

        if(!task){
            return res.status(404).json({
                success : false,
                message : "Task not found"
            })
        }

        const project = await Project.findById(task.project);
        if(!project){
            return res.status(404).json({
                success : false,
                message : "No project found"
            })
        }
        if(project.leader.toString() !== req.user.userId){
            return res.status(403).json({
                success : false,
                message : "Only leader can add members"
            })
        }
        const member = await User.findOne({email});
        if(!member) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        if(!project.members.includes(member._id as mongoose.Schema.Types.ObjectId)) {
            return res.status(400).json({ 
                success: false, 
                message: "User is not part of this project" 
            });
        }

        if(task.assignedTo.includes(member._id as mongoose.Schema.Types.ObjectId)) {
          return res.status(400).json({ success: false, message: "Member already assigned to this task" });
        }

        task.assignedTo.push(member._id as mongoose.Schema.Types.ObjectId);
        await task.save();

        res.status(200).json({ 
            success: true, 
            message: "Member added to task", task 
        });
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export const removeMember = async (req : Request , res : Response)=>{
    try{
        const taskId = req.params.id;
        const {email} =req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Please enter mail"
            })
        }
        const task = await Task.findById(taskId).populate("project");
        if(!task){
            return res.status(400).json({
                success: false,
                message: "Task not found"
            })
        }
        
        const project = await Project.findById(task.project);
        if(!project){
            return res.status(400).json({
                success : false,
                message: "Project not found"
            })
        }

        if(project.leader.toString() !== req.user.userId){
            return res.status(403).json({
                success : false,
                message : "Only leader can add members"
            })
        }

        const member = await User.findOne({email});
        if(!member){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        const memberId = member._id as mongoose.Schema.Types.ObjectId
        task.assignedTo = task.assignedTo.filter(id => id.toString() !== memberId.toString())
        await task.save();

        return res.status(200).json({
            success : true,
            message :"Member removed from task", task
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}