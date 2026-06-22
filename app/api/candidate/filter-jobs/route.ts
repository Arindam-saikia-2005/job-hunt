import { dbConnect } from "@/lib/db";
import { Job } from "@/models/job.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect()
    try {
        const { salary, location, experince, jobType } = await req.json();
        const query: any = {};

        if (location) {
            query.location = {
                $regex: location,
                $options: "i"
            };
        }

        if (jobType) {
            query.jobType = jobType
        }

        if (experince) {
            query.experince = {
                $lte: Number(experince)
            }
        }

        if (salary) {
            query.salary = {
                $gte: Number(salary)
            }
        }

        const jobs = await Job.find(query);

        return NextResponse.json({
            success: true
            ,
            jobs
        }, { status: 200 });

    } catch (err: any) {
        console.error("Error while filtering jobs", err.message);
        return NextResponse.json({ msg: "Internal server error" })
    }
}