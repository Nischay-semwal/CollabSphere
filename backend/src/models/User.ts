import mongoose , {Schema , Document} from "mongoose";

export interface IUser extends Document {
    name : string ,
    email : string ,
    password  : string ,
    role : "leader" | "member",
    createdAt : Date,
    updatedAt : Date 
}

const UserSchema : Schema<IUser> = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required  : true,
        lowercase : true,
        unique : true,
        trim : true
    },
    password : {
        type : String ,
        required : true, 
        trim : true,
    },
    role : {
        type : String, 
        enum : ['leader', 'member'],
        default : 'member'
    }
},{  timestamps : true });

export default mongoose.model<IUser>('User' , UserSchema);