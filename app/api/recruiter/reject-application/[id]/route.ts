import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Application } from "@/models/application.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ success: false, msg: "Not Authenticared" }, { status: 403 });

    if (session.user.role !== "RECRUITER") return NextResponse.json({ success: false, msg: "UnAuthorized" }, { status: 403 });

    await dbConnect();

    try {
        const { id: applicationId } = await context.params;

        const application = await Application.findById(applicationId);

        if (!application) return NextResponse.json({ success: false, msg: "Application not found!" }, { status: 404 });

        if (application.job.recruiter.toString() !== session.user.id) return NextResponse.json({ msg: "Only recruiter can reject an application" }, { status: 401 });

        const updatedApplication = await Application.findByIdAndUpdate(applicationId, {
            status: "Reject"
        }, {
            new: true
        })
        return NextResponse.json({ success: true, updatedApplication }, { status: 200 })
    } catch (error: any) {
        console.error("Error while Rejecting an application", error.message);
        return NextResponse.json({
            msg: "Internal server error"
        }, {
            status: 500
        })
    }
}