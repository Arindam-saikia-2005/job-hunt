import * as z from "zod";

export const userSchema = z.object({
    name: z.string().min(5).max(15),
    email: z.email().lowercase().regex(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/),
    password: z.string().regex(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/).min(8)
})

export const jobSchema = z.object({
    title: z.string(),
    description: z.string().max(100),
    skills: z.array(z.string()),
    salary: z.number(),
    location: z.string(),
    experince: z.number,
    jobType: z.string()

})