import type { Request , Response} from 'express';
import Project from '../models/Project';
import User from '../models/User';
import mongooose from 'mongoose'


export const createProject = async (req : Request,res : Response)=>{
    try{
        const {name ,description, deadline, members} = req.body;

        if(!req.user){
            return res.status(401).json({
                success : false,
                message : "Unauthorized access"
            })
        }
        if(req.user.role !== 'leader'){
            return res.status(403).json({
                success : false,
                message : "Only leaders are allowed to make a project"
            })
        }

        const existingProject = await Project.findOne({name});

        if(existingProject){
            return res.status(400).json({
                success : false,
                message : "Project already exists"
            })
        }
        const newProject = await Project.create({
            name ,
            description,
            deadline ,
            leader : req.user.userId,
            members 
        })

        return res.status(201).json({
            success : true,
            message : "Project created successfully",
            newProject
        })

    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Unable to create project , internal server error"
        })
    }
}

export const getAllProjects = async (req: Request , res : Response) =>{
    try{
        const projects = await Project.find({
            $or:[
                {leader : req.user.userId},
                {members : req.user.userId}
            ]
        })
    
        if(projects.length === 0){
            return res.status(404).json({
                success : false,
                message : "No projects found"
            })
        }
    
        return res.status(200).json({
            success : true,
            message : "success",
            projects
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Server error"
        })
    }
}

export const updateMember = async (req :Request , res : Response)=>{
    try{
        const projectId = req.params.id;
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Email is required to add a member"
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
                success : false,
                message : "Only project leader can add members"
            })
        };

        const member = await User.findOne({email});
        if(!member){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }

        if(project.members.includes(member._id as mongooose.Schema.Types.ObjectId)){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }

        project.members.push(member._id as mongooose.Schema.Types.ObjectId);
        await project.save();

        return res.status(200).json({
            success : true,
            message : "Member added to the project",
            project
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export const removeMember = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const { memberId } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.leader.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only project leader can remove members",
      });
    }

    if (!project.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this project",
      });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== memberId
    );

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      project,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
