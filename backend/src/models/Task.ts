import mongoose, { Schema ,Document} from "mongoose";

interface ITask extends Document {
    title : string,
    description? : string,
    project : Schema.Types.ObjectId,
    assignedTo : Schema.Types.ObjectId[],
    status : 'pending' | 'in-progress' | 'completed',
    deadline? : Date,
    createdAt : Date,
    updatedAt : Date
}

const TaskSchema : Schema<ITask> = new Schema({
    title : {
        type : String,
        trim : true,
        required : true
    },
    description : {
        type : String ,
        trim : true
    },
    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required:true
    },
    assignedTo : [
        {
        type : Schema.Types.ObjectId,
        ref : "User",
        }
    ],
    status : {
        type : String ,
        enum : ['pending','in-progress','completed'] ,
        default: 'pending'
    },
    deadline : {
        type :Date
    }
},{timestamps : true})

export default mongoose.model<ITask>('Task', TaskSchema);