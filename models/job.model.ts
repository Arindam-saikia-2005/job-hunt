import mongoose, { model, Schema, Types } from "mongoose"

interface IJob {
    _id: Types.ObjectId;
    recruiterId: Types.ObjectId;
    title: string;
    description: string;
    skills: [];
    salary: string | number;
    location: string;
    experince: string | number;
    jobType: string;
}

const jobSchema = new Schema<IJob>({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    salary: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experince: {
        type: String
    },
    jobType: {
        type: String
    }
})

export const Job = model<IJob>("Job", jobSchema);