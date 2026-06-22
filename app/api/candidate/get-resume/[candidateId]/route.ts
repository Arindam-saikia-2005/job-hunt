import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context: { params: Promise<{ candidateId: string }> }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ msg: "Not Authenticated" }, { status: 401 })
    try {
        const { candidateId } = await context.params;

        const user  = await User.findById(candidateId);

        if(!user) return NextResponse.json({err:`no user found with this ${candidateId}`});

        return NextResponse.json({
            resume:user?.resume
        },{
            status:200
        })


    } catch (err: any) {
        console.error("Error while getting the resume", err.message);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}