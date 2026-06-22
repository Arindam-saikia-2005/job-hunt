import mongoose, { model, Schema, Types } from "mongoose";


type ApplicationStatus = "Accept" | "Reject" | "Pending";

interface IApplication {
    _id: Types.ObjectId;
    jobId: Types.ObjectId;
    candidateId: Types.ObjectId;
    status: ApplicationStatus;
}

const applicationSchema = new Schema<IApplication>({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required:true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    status: {
        type: String,
        enum: ["Accept", "Reject", "Pending"],
        default:"Pending"
    }
},{
    timestamps:true
})

export const Application = mongoose.models?.Application || mongoose.model<IApplication>("Application", applicationSchema);