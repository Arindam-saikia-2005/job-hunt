import * as z from "zod";

export const userSchema = z.object({
    name: z.string().min(5).max(15),
    email: z.email(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8)
})

export const jobSchema = z.object({
    title: z.string(),
    description: z.string().min(20).max(100),
    skills: z.string(),
    salary: z.number(),
    location: z.string(),
    experince: z.number,
    jobType: z.string()
})


export const companySchema = z.object({
    name:z.string(),
    description:z.string(),
    website:z.string().url(),
    logo:z.string().url(),
})