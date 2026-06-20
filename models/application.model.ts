import mongoose, { model, Schema, Types } from "mongoose";


type ApplicationStatus = "Accept" | "Reject" | "Pending";

interface IApplication {
    _id: Types.ObjectId;
    jobId: Types.ObjectId;
    candidateId: Types.ObjectId;
    resume: string;
    status: ApplicationStatus;
}

const applicationSchema = new Schema<IApplication>({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resume: {
        type: String
    },
    status: {
        type: String,
        enum: ["Accept", "Reject", "Pending"]
    }
})

export const Application = model<IApplication>("Application", applicationSchema);