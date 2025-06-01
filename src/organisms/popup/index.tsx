"use client";

import React from "react";
import "./style.css"
import { CommonPopupProps } from "@/props";

export const Popup = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}: CommonPopupProps) => {
  return (
    <section className="popup-overlay" onClick={onCancel}>
      <section className="popup-content" onClick={(e) => e.stopPropagation()}>
        <section className="popup-header">
          <h2>{title}</h2>
        </section>
        <p className="popup-message">{message}</p>
        <section className="popup-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </section>
      </section>
    </section>
  );
};
