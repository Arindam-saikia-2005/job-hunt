import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Job } from "@/models/job.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { User } from "@/models/user.model";
import { Application } from "@/models/application.model";

export async function POST(req: NextRequest, context: { params: Promise<{ jobId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ msg: "Not Authenticated", success: false }, { status: 401 })
    await dbConnect()
    try {
        const { jobId } = await context.params;
        const { resume } = await req.json();

        if (!resume) return NextResponse.json({ msg: "Resume is required" }, { status: 400 })

        const user = await User.findById(session.user.id);

        if (!user) return NextResponse.json({ msg: "User not found" }, { status: 404 });

        if (user.role !== "CANDIDATE") return NextResponse.json({ msg: "only candidate can apply for jobs" }, { status: 403 })

        const job = await Job.findById(jobId);

        if (!job) return NextResponse.json({ message: "Job not found", success: false }, { status: 404 });

        const existingApplication = await Application.findOne({
            jobId,
            candidateId: user._id
        });

        if (existingApplication) {
            return NextResponse.json(
                {
                    success: false,
                    msg: "You have already applied for this job",
                },
                { status: 400 }
            );
        }

        if (!user.resume) {
            const uploadResponse = await cloudinary.uploader.upload(resume);

            await User.findByIdAndUpdate(user._id, {
                resume: uploadResponse.secure_url
            });
        }

        await Application.create({
            jobId,
            candidateId: user._id
        })


        return NextResponse.json({ success: true, msg: "Job application submitted successfully!" }, { status: 200 })


    } catch (err: any) {
        console.log("Error while applying for the jobs", err.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}