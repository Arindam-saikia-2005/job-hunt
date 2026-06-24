import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { jobSchema } from "@/lib/types";
import { Job } from "@/models/job.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, context: { params: Promise<{ jobId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, msg: "Not Authenticated" }, { status: 401 });
    await dbConnect()
    try {
        const { jobId } = await context.params;
        const body = await req.json();
        const { title, description, skills, salary, location, experince, jobType } = jobSchema.parse(body);

        if (session.user.role !== "RECRUITER") return NextResponse.json({ success: false, msg: "Not Authorized" }, { status: 401 });

        const updatedCourse = await Job.findByIdAndUpdate(jobId, {
            title,
            description,
            skills,
            salary,
            location,
            experince,
            jobType
        })

        return NextResponse.json({ success: true, updatedCourse }, { status: 200 })

    } catch (err: any) {
        console.error("Error while Editing the job details", err.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}