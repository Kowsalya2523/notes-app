"use client";

import assets from "@/assets";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { AddNote } from "@/organisms";

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const NotesList = () => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:3001/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddClick = () => {
    setShowAddNote(true);
  };

  const handleCancel = () => {
    setShowAddNote(false);
    fetchNotes();
  };

  return (
    <section className="list-content">
      <section className="add-wrapper" onClick={handleAddClick}>
        <Image src={assets.ic_add} alt="add-icon" />
        <h4>Add note</h4>
      </section>
      {notes.length === 0 ? (
        <section className="notes-empty">
          <Image src={assets.img_empty_note} alt="empty-note" />
          <h3>Ooooopsss!!!</h3>
          <h4>No notes yet... but the ideas are waiting!</h4>
        </section>
      ) : (
        <section className="notes-list">
          {notes.map((note) => (
            <section className="note-card" key={note.id}>
              <section className="note-title">
                <h4 className="note-title-text">{note.title}</h4>
                <p className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </section>
              <p className="note-description">{note.description}</p>
            </section>
          ))}
        </section>
      )}

      {showAddNote && (
        <section className="modal-overlay" onClick={handleCancel}>
          <section
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <AddNote onCancel={handleCancel} />
          </section>
        </section>
      )}
    </section>
  );
};

export default NotesList;
