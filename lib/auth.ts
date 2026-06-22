import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import { User } from "@/models/user.model";
import bcrypt from "bcrypt";


const nextAuth_secret = process.env.NEXTAUTH_SECRET;

if (!nextAuth_secret) throw new Error("Please put an vaild secret")

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email and password")
                }
                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                if (!user) throw new Error("No user found with this email");

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) throw new Error("Invalid password")

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.role) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    secret: nextAuth_secret
};