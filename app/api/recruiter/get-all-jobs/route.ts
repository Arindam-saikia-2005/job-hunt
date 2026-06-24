import { dbConnect } from "@/lib/db";
import { Job } from "@/models/job.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const allJobs = await Job.find({
            status: "APPROVED"
        });
        if (!allJobs) return NextResponse.json({ success: false, msg: "No job found!" }, { status: 404 });
        return NextResponse.json({ allJobs }, { status: 200 })
    } catch (err: any) {
        console.log("Error while getting all the jobs", err.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}