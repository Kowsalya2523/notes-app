"use client";

import assets from "@/assets";
import Image from "next/image";
import "./style.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NotificationPopup } from "../toggle-notify";

export const BaseContainer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type?: "error" | "success" | "warning" | "info";
    show: boolean;
  }>({
    message: "",
    type: undefined,
    show: false,
  });

  const showLoginSignupButtons =
    pathname === "/" || pathname === "/login" || pathname === "/sign-up";

  const onLogout = () => {
    setNotification({
      message: "Logged out successfully!",
      type: "success",
      show: true,
    });
    push("/");
  };

  return (
    <section>
      <section className="header-section">
        <Image src={assets.img_logo} alt="logo-image" />
        <section className="button-wrapper">
          {showLoginSignupButtons ? (
            <>
              <Link href="/login">
                <button>Login</button>
              </Link>
              <Link href="/sign-up">
                <button>SignUp</button>
              </Link>
            </>
          ) : (
            <button onClick={onLogout}>Logout</button>
          )}
        </section>
      </section>
      <main className="base-main">{children}</main>
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </section>
  );
};
