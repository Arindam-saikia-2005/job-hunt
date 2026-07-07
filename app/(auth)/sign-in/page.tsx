"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: [e.target.value] });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        toast.error("login error");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex bg-[#FAFAFA] items-center justify-center min-h-screen w-full text-black">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col bg-[#fdfdfd] border-2 border-gray-200  rounded-2xl px-6 py-4 items-center justify-center space-y-5">
          <div className="flex flex-col self-start p-4">
            <p className="text-2xl font-semibold">Login</p>
            <p className="">to get started</p>
          </div>
          <input
            className="border bg-[#ffffff] border-gray-400  px-10 py-2  rounded-xl"
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            type="email"
            placeholder="Email"
          />
          <input
            className="border border-gray-400  px-10 py-2  rounded-xl"
            name="password"
            value={formData.password}
            onChange={handleOnChange}
            type="password"
            placeholder="Password"
          />
          <button
            className="px-4 py-2 bg-[#0016df] rounded-md w-full text-gray-200"
            type="submit"
          >
            continue
          </button>
          <div className="p-2">
            <p className="text-sm">
              New User?{" "}
              <Link href="/sign-up/candidate">
                <span className="text-blue-600 font-semibold">Register</span>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
