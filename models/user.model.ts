import mongoose, { model, Schema, Types } from "mongoose";

type Roles = "CANDIDATE" | "ADMIN" | "RECURITER"


interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Roles;
    skills: []
}

const userSchema = new Schema<IUser>({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
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
    role: {
        type: String,
        enum: ["CANDIDATE", "ADMIN", "RECURITER"]
    },
    skills: [{
        type: String,
        required: true,
    }]
})

export const User = model<IUser>("User", userSchema)



