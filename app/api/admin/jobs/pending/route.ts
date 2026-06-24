import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Job } from "@/models/job.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ msg: "Not authenticated" }, { status: 403 })
    await dbConnect();
    try {
        const jobs = await Job.find({
            status: "PENDING"
        }).populate("recruiterId");
        if (!jobs) {
            return NextResponse.json({ success: false, msg: "No pending job found" }, {
                status: 404
            })
        }
        return NextResponse.json({ jobs }, { status: 200 })
    } catch (err: any) {
        console.log("Error while getting pending jobs", err.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}