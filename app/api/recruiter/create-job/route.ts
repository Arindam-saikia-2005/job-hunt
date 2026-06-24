import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { jobSchema } from "@/lib/types";
import { Job } from "@/models/job.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "RECRUITER") {
        return NextResponse.json({ success: false, msg: "Not Authenticated" }, { status: 401 })
    }
    try {
        const body = await req.json();
        const { title, description, skills, salary, location, experince, jobType } = jobSchema.parse(body);

        if (!title || !description || !skills || !salary || !location || !experince || !jobType) {
            return NextResponse.json({ success: false, msg: "All Fields are required" }, { status: 400 });
        }

        if (session.user.role !== "RECRUITER") {
            return NextResponse.json({ success: false, msg: "Not Authorized!" }, { status: 401 })
        }

        const newJob = await Job.create({
            recruiterId: session.user.id,
            title,
            description,
            skills,
            salary,
            location,
            experince,
            jobType
        })

        return NextResponse.json({ success: true, msg: "Job Created successfully" }, { status: 201 });
    } catch (err: any) {
        console.error("Error while creating a job", err.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}