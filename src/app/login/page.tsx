"use client";

import assets from "@/assets";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/controller/firebase";
import { useRouter } from "next/navigation";
import type {
  ConfirmationResult,
  RecaptchaVerifier as RecaptchaVerifierType,
} from "firebase/auth";
import { NotificationPopup } from "@/organisms";
import { API_LOGIN, API_USERS } from "@/utils/api-constants";

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
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const {push} = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type?: "error" | "success" | "warning" | "info";
    show: boolean;
  }>({
    message: "",
    type: undefined,
    show: false,
  });
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSendOtp(true);

    const phoneNumber = `+91${mobile}`;
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setNotification({
        message: "OTP sent successfully!",
        type: "success",
        show: true,
      });
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setNotification({
        message: "Failed to send otp. Try again!",
        type: "error",
        show: true,
      });
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingVerifyOtp(true);

    try {
      await confirmationResult?.confirm(otp);

      const checkRes = await fetch(`${API_USERS}?mobile=${mobile}`);
      const users = await checkRes.json();

      if (users.length > 0) {
       await fetch(API_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile,
            loginTime: new Date().toISOString(),
          }),
        });
        setNotification({
          message: "Logged in successfully!",
          type: "success",
          show: true,
        });
        setTimeout(() => {
          push("/notes-list");
        }, 1000);
      } else {
        setNotification({
          message: "This number is not registered. Please sign up first.",
          type: "warning",
          show: true,
        });
        push(`/sign-up?mobile=${mobile}`);
      }
    } catch (error) {
      console.error("Error verifying OTP or checking user:", error);
      setNotification({
        message: "Something went wrong. Try again!",
        type: "error",
        show: true,
      });
    } finally {
      setLoadingVerifyOtp(false);
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
              disabled={loadingSendOtp} 
            />
            <button
              type="submit"
              disabled={loadingSendOtp}
              className={loadingSendOtp ? "button-loading" : ""}
            >
              {loadingSendOtp ? (
                <>
                  <span className="spinner" /> Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
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
              disabled={loadingVerifyOtp} 
            />
            <button
              type="submit"
              disabled={loadingVerifyOtp}
              className={loadingVerifyOtp ? "button-loading" : ""}
            >
              {loadingVerifyOtp ? (
                <>
                  <span className="spinner" /> Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        )}
      </section>
      <div id="recaptcha-container"></div>
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </section>
  );
};

export default Login;
