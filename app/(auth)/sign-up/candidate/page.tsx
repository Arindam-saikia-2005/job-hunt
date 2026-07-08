"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

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
    email: "",
    name: "",
    password: "",
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return  passRegex.test(password);
  };

  const validateForm = () => {
    let newErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email formate";
    }
    if (!formData.password) {
      newErrors.password = "Password is Required!";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "Invalid password!";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const vaildForm = validateForm();

      if (!vaildForm) return;

      const res = await axios.post("/api/auth/register/candidate", formData);
      if (res.data.success) {
        toast.success("successfully signed up!");
        setFormData({ name: "", email: "", password: "" });
      } else {
        toast.error("Something went wrong!");
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
            className={` border  text-sm px-10 py-2 rounded-sm ${errors.name ? "border-red-500" : "border-gray-400"}`}
            name="name"
            value={formData.name}
            onChange={handleOnChange}
            type="text"
            placeholder="Enter your Name..."
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            className="border bg-[#ffffff] border-gray-400  px-10 py-2  rounded-sm"
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            type="email"
            placeholder="Enter your Email..."
          />
          <input
            className="border border-gray-400  px-10 py-2  rounded-sm"
            name="password"
            value={formData.password}
            onChange={handleOnChange}
            type="password"
            placeholder="Enter your Password..."
          />
          <button
            className="px-4 py-3 bg-[#0016df] rounded-md w-full text-gray-200"
            type="submit"
          >
            SignUp
          </button>
          <p className="text-sm font-semibold">
            Are you a Recruiter ? {""}
            <Link href="/sign-up/recruiter">
              <span className="text-blue-600">Click Here</span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
