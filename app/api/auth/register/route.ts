import { dbConnect } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { userSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json()
        const { name, email, password } = userSchema.parse(body)

        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) return NextResponse.json({ msg: "User already exist" }, {
            status: 400
        });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        });

        await newUser.save();

        NextResponse.json({ newUser }, { status: 201 })
    } catch (error: any) {
        console.log("Error while registering an user", error.message);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        })
    }
}