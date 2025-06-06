"use client";

import assets from "@/assets";
import Image from "next/image";
import "./page.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationPopup } from "@/organisms";
import { API_USERS } from "@/utils/api-constants";

const SignUp = () => {
  const searchParams = useSearchParams();
  const prefilledMobile = searchParams.get("mobile") || "";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [notification, setNotification] = useState<{
    message: string;
    type?: "error" | "success" | "warning" | "info";
    show: boolean;
  }>({
    message: "",
    type: undefined,
    show: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (prefilledMobile) {
      setFormData((prev) => ({ ...prev, phone: prefilledMobile }));
    }
  }, [prefilledMobile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const check = await fetch(
      `${API_USERS}?mobile=${formData.phone}`
    );
    const existingUsers = await check.json();
    if (existingUsers.length > 0) {
      setNotification({
            message: "Mobile number already registered",
            type: "info",
            show: true,
          })
      return;
    }

    const res = await fetch(API_USERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        mobile: formData.phone,
      }),
    });

    if (res.ok) {
      setNotification({
        message: "Signup successfully!",
        type: "success",
        show: true,
      });
      router.push("/notes-list");
    } else {
      setNotification({
        message: "Failed to sign in. Try again!",
        type: "error",
        show: true,
      });
    }
  };

  return (
    <section className="login-wrapper">
      <section className="left-wrapper">
        <Image
          src={assets.img_login}
          alt="login-image"
          height={380}
          width={380}
        />
        <h2 className="login-text">Your notes missed you.</h2>
        <h2 className="login-text">
          Log in and pick up right where you left off.
        </h2>
      </section>
      <section className="signup-card">
        <h2 className="title">Create Your Account</h2>
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your Full Name"
            required
            onChange={handleChange}
          />
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your mobile number"
            pattern="[0-9]{10}"
            required
            onChange={handleChange}
          />
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>
      </section>
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </section>
  );
};

export default SignUp;
