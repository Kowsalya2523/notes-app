import assets from "@/assets";
import Image from "next/image";
import "./style.css";
import Link from "next/link";

export const BaseContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <section className="header-section">
        <Image src={assets.img_logo} alt="logo-image" />
        <section className="button-wrapper">
          <Link href="/login">
            <button>Login</button>
          </Link>
          <Link href="/sign-up">
            <button>SignUp</button>
          </Link>
        </section>
      </section>
      <main className="base-main">{children}</main>
    </section>
  );
};
