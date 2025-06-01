"use client";

import assets from "@/assets";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "@/controller/firebase";
import { useRouter } from "next/navigation";
import type { ConfirmationResult, RecaptchaVerifier as RecaptchaVerifierType } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifierType;
    confirmationResult: ConfirmationResult;
  }
}


const Login = () => {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = `+91${mobile}`;
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      alert('Otp Sent Successfully');
      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Try again.');
    }
  };

const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await confirmationResult?.confirm(otp);

    const checkRes = await fetch(`http://localhost:3001/users?mobile=${mobile}`);
    const users = await checkRes.json();

   if (users.length > 0) {
  await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mobile,
      loginTime: new Date().toISOString()
    })
  });
  alert(`Logged in successfully with mobile: ${mobile}`);
  router.push('/');
} else {
  alert('This number is not registered. Please sign up first.');
  router.push(`/sign-up?mobile=${mobile}`);
}
  } catch (error) {
    console.error('Error verifying OTP or checking user:', error);
    alert('Something went wrong. Please try again.');
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
      <section className="login-card">
        <h2 className="title">
          {step === "mobile" ? "One Step Closer to Your Notes!!" : "Enter OTP"}
        </h2>
        {step === "mobile" ? (
          <form className="form-wrapper" onSubmit={handleSendOtp}>
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              pattern="[0-9]{10}"
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        ) : (
          <form className="form-wrapper" onSubmit={handleVerifyOtp}>
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}
      </section>
      <div id="recaptcha-container"></div>
    </section>
  );
};

export default Login;
