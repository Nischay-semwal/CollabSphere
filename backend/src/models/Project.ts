import mongoose, { Schema } from "mongoose";

export interface IProject extends Document {
    name : string,
    description? : string,
    leader : Schema.Types.ObjectId,
    members : Schema.Types.ObjectId[],
    status : "active" | "completed" | "on-hold",
    createdAt : Date,
    updatedAt : Date,
    deadline? : Date
}

const ProjectSchema : Schema<IProject> =  new Schema({
    name : {
        type : String ,
        required : true,
        unique : true,
        trim : true
    },
    description : {
        type : String ,
        trim : true
    },
    leader : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    members : [
        {
        type : Schema.Types.ObjectId,
        ref : "User"
        }
    ],
    status : {
        type : String ,
        enum : ['active', 'completed','on-hold'],
        default : 'active'
    },
    deadline :{
        type : Date,
        required : false
    }
},{ timestamps : true})

export default mongoose.model<IProject>("Project",ProjectSchema);