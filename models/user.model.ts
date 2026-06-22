import  mongoose, { Schema, Types } from "mongoose";

type Roles = "CANDIDATE" | "ADMIN" | "RECRUITER"


interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    resume?:string;
    role: Roles;
    skills?: string[]
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    resume:{
     type:String,
     default:"",
    },
    role: {
        type: String,
        enum: ["CANDIDATE", "ADMIN", "RECRUITER"],
        default:"CANDIDATE"
    },
    skills: [{
        type: String,
        required: true,
    }]
})

export const User = mongoose.models?.User ||  mongoose.model<IUser>("User", userSchema)



