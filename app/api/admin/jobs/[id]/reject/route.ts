import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Job } from "@/models/job.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ msg: "unAuthorized" }, { status: 401 })
    }
    await dbConnect();
    try {
        const { id: jobId } = await context.params;
        await Job.findByIdAndUpdate(jobId, {
            status: "REJECTED"
        });
        return NextResponse.json({ success: true, msg: "Job Approved successfully" }, { status: 200 })
    } catch (error: any) {
        console.log("Error while approving the job", error.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}