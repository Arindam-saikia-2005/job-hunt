import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Application } from "@/models/application.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ msg: "Not Authenticated" }, { status: 403 });
    if (session.user.role !== "RECRUITER") {
        return NextResponse.json({ msg: "Not Authorized" }, { status: 401 })
    }
    await dbConnect();
    try {
        const allApplications = await Application.find({});
        if (!allApplications) {
            return NextResponse.json({ msg: "Could not find any application" }, { status: 404 })
        }
        return NextResponse.json({ success: true, allApplications }, { status: 200 })
    } catch (error: any) {
        console.log("Error While getting all the applications", error.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}