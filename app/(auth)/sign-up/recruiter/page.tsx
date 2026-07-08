"use client";

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { userSchema } from "@/lib/types";

interface ErrorType {
  name: string;
  email: string;
  password: string;
}

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorType>({
    name: "",
    email: "",
    password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = userSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        setErrors({
          name: fieldErrors.name?.join(", ") ?? "",
          email: fieldErrors.email?.join(", ") ?? "",
          password: fieldErrors.password?.join(", ") ?? "",
        });
        return;
      }

      const res = await axios.post("/api/auth/register/recruiter", formData);
      if (res.data.success) {
        toast.success("SignedUp successfully!");
      } else {
        toast.error("SomeThing went wrong!");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <div className="flex bg-[#FAFAFA] items-center justify-center min-h-screen w-full text-black">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col bg-[#fdfdfd] border border-gray-200 rounded-2xl p-8 items-center justify-center space-y-5">
          <div className="flex flex-col self-start">
            <p className="text-2xl font-semibold">Register</p>
            <p className="">to get started</p>
          </div>
          <input
            className={`border text-sm px-10 py-2 rounded-sm ${errors.name ? "border-red-500" : "border-gray-400"} `}
            name="name"
            value={formData.name}
            onChange={handleOnChange}
            type="text"
            placeholder="Enter your Name..."
          />
          {errors.name && (
            <p>{errors.name[0]}</p>
          )}
          <input
            className={`border bg-[#ffffff] px-10 py-2  rounded-sm ${errors.email ? "border-red-500" : "border-gray-400"}`}
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            type="email"
            placeholder="Enter your Email..."
          />
           {errors.email && (
            <p>{errors.email[0]}</p>
          )}
          <input
            className={`border border-gray-400  px-10 py-2  rounded-sm ${errors.password ? "border-red-500" : "border-gray-400" }`}
            name="password"
            value={formData.password}
            onChange={handleOnChange}
            type="password"
            placeholder="Enter your Password..."
          />
           {errors.password && (
            <p>{errors.password[0]}</p>
          )}
          <button
            className="px-4 py-3 bg-[#0016df] rounded-md w-full text-gray-200"
            type="submit"
          >
            create now
          </button>
          <p className="text-sm font-semibold">
            Already have an Account ? {""}
            <Link href="/sign-in">
              <span className="text-blue-600">Login</span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
