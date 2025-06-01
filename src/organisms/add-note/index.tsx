"use client";

import React, { useState } from "react";
import "./style.css";
import { AddNoteProps } from "@/props";

export const AddNote = ({ onCancel }: AddNoteProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");



  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const newNote = {
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }
      onCancel(); 
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Something went wrong while saving the note.");
    }
  };

  return (
    <section className="add-note-wrapper">
      <form onSubmit={handleCreate} className="add-note-form">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
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
            Create
          </button>
        </section>
      </form>
    </section>
  );
};
