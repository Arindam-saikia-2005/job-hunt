import { dbConnect } from "@/lib/db";
import { userSchema } from "@/lib/types";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { name, email, password } = userSchema.parse(body);

        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return NextResponse.json({ success: false, message: "User already Exist with this email" }, { status: 401 })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role: "RECRUITER"
        })

        return NextResponse.json({
            success: true, user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        }, { status: 201 })

    } catch (err: any) {
        console.error("Error while creating recruiter account", err.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}