import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Job } from "@/models/job.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, context: { params: Promise<{ jobId: string }> }) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "RECRUITER") {
        return NextResponse.json({ success: false, msg: "Not Authenticated" }, { status: 401 })
    }
    try {
        const { jobId } = await context.params;
        const job = await Job.findById(jobId);
        if (!job) return NextResponse.json({ success: false, msg: "Job not found" }, { status: 404 });

        if (session.user.role !== "RECRUITER") return NextResponse.json({ success: false, msg: "Not Authorized" }, { status: 401 });

        await Job.deleteOne();
        return NextResponse.json({ success: true, msg: "Job deleted successFully!" }, { status: 200 })
    } catch (err: any) {
        console.log("Error while deleting a job", err.message);
        return NextResponse.json({ success: false, msg: "Internal server error" }, { status: 500 })
    }
}