"use client";

import assets from "@/assets";
import Image from "next/image";
import { useEffect } from "react";
import styles from "./style.module.css";
import { NotificationPopupProps } from "@/props";

export const NotificationPopup = ({
  message,
  type = "info",
  show,
  onClose,
  autoDismiss = true,
  duration = 3000,
}: NotificationPopupProps) => {
  useEffect(() => {
    if (show && autoDismiss) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoDismiss, duration, onClose]);

  if (!show) return null;

  return (
    <section className={`${styles.notification} ${styles[type]}`}>
      <span className={styles.icon}>
        {type === "success" && "✔"}
        {type === "error" && "⚠"}
        {type === "warning" && "⚠"}
        {type === "info" && "ℹ"}
      </span>
      <span className={styles.message}>{message}</span>
      <Image src={assets.ic_close} alt={"close"} width={14} height={14} />
    </section>
  );
};
