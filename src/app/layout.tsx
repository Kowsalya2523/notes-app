import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { BaseContainer } from "@/organisms";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Notes App - Organize Your Thoughts Seamlessly",
  description:
    "A simple and powerful notes app to manage your tasks, ideas, and reminders efficiently.",
  keywords: [
    "notes app",
    "note-taking",
    "task manager",
    "reminders",
    "productivity",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <BaseContainer>{children}</BaseContainer>
      </body>
    </html>
  );
}
