"use client";

import React, { useState, useEffect } from "react";
import "./style.css";
import { AddNoteProps } from "@/props";
import { API_NOTES } from "@/utils/api-constants";

export const AddNote = ({ onCancel, noteToEdit }: AddNoteProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setDescription(noteToEdit.description);
    }
  }, [noteToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const notePayload = {
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    try {
      const url = noteToEdit ? `${API_NOTES}/${noteToEdit.id}` : API_NOTES;

      const method = noteToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notePayload),
      });

      if (!res.ok) {
        throw new Error("Failed to save note");
      }
      onCancel();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Something went wrong while saving the note.");
    }
  };

  return (
    <section className="add-note-wrapper">
      <form onSubmit={handleSubmit} className="add-note-form">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <section className="button-group">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="create-btn">
            {noteToEdit ? "Update" : "Create"}
          </button>
        </section>
      </form>
    </section>
  );
};
