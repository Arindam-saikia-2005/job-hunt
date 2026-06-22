import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary"
import { User } from "@/models/user.model";


// upload resume
export async function POST(req: NextRequest) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "not Authenticated" }, { status: 401 })

    try {
        const {resume} = await req.json();

        if (!resume) return NextResponse.json({ msg: "Resume is required" }, { status: 400 })

        const uploadResponse = await cloudinary.uploader.upload(resume);

        await User.findByIdAndUpdate(session.user?.id,{
            resume:uploadResponse.secure_url
        })
       return  NextResponse.json({msg:"Resume upload successfully"},{status:200})
    } catch (err: any) {
        console.error("Error while uploading the resume");
        return NextResponse.json
            ({
                msg: "Internal servre error"
            }, {
                status: 500
            })
    }



    
}

// Filter jobs


