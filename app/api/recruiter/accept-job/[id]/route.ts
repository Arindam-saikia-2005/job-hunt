import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Application } from "@/models/application.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ msg: "Not Authenticated" }, { status: 403 });
    if (session.user.role !== "RECRUITER") return NextResponse.json({ success: false, msg: "Not Authorized" }, { status: 401 });
    await dbConnect()
    try {
        const { id: applicationId } = await context.params;

        const application = await Application.findById(applicationId).populate("job");

        if (!application) return NextResponse.json({ success: false, msg: "Application not found" }, { status: 404 });

        if (application.status === "Accept") {
            return NextResponse.json(
                { success: false, msg: "Application already accepted" },
                { status: 400 }
            );
        }

        if (application.job.recruiter.toString() !== session.user.id) {
            return NextResponse.json({
                success: false,
                msg: "Not Authorized"
            }, {
                status: 401
            })
        }

        const updatedApplication = await Application.findByIdAndUpdate(applicationId, {
            status: "Accept"
        }, {
            new: true
        })
        return NextResponse.json({ success: true, updatedApplication }, { status: 200 })
    } catch (error: any) {
        console.error("Error while Accepting the cadidate's application", error.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}