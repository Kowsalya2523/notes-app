"use client";

import assets from "@/assets";
import Image from "next/image";
import "./style.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NotificationPopup } from "../toggle-notify";
import { Popup } from "../popup";

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

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const showLoginSignupButtons =
    pathname === "/" || pathname === "/login" || pathname === "/sign-up";

  const confirmLogout = () => {
    setNotification({
      message: "Logged out successfully!",
      type: "success",
      show: true,
    });
    setShowConfirmLogout(false);
    push("/");
  };

  return (
    <section>
      <section className="header-section">
        <Link href="/">
          <Image src={assets.img_logo} alt="logo-image" />
        </Link>
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
            <button onClick={() => setShowConfirmLogout(true)}>Logout</button>
          )}
        </section>
      </section>

      <main className="base-main">{children}</main>
      {showConfirmLogout && (
        <Popup
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={() => setShowConfirmLogout(false)}
        />
      )}
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </section>
  );
};
