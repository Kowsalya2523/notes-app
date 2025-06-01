"use client";

import assets from "@/assets";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { AddNote, Popup } from "@/organisms";
import { API_NOTES } from "@/utils/api-constants";
import { Note } from "@/model";

const NotesList = () => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch(API_NOTES);
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

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
    setShowAddNote(true);
  };

  const onCancel = () => {
    setShowAddNote(false);
    setNoteToEdit(null);
    fetchNotes();
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await fetch(`${API_NOTES}/${noteToDelete.id}`, {
        method: "DELETE",
      });
      setShowDeletePopup(false);
      setNoteToDelete(null);
      fetchNotes();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <section className="list-content">
      <section className="header-wrapper">
        <section className="add-wrapper" onClick={handleAddClick}>
          <Image src={assets.ic_add} alt="add-icon" />
          <h4>Add note</h4>
        </section>
        <input
          type="text"
          placeholder="Search notes..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </section>
      {filteredNotes.length === 0 ? (
        <section className="notes-empty">
          <Image src={assets.img_empty_note} alt="empty-note" />
          <h3>Ooooopsss!!!</h3>
          <h4>No notes yet... but the ideas are waiting!</h4>
        </section>
      ) : (
        <section className="notes-list">
          {filteredNotes.map((note) => (
            <section className="note-card" key={note.id}>
              <section className="note-title">
                <Image
                  src={assets.ic_delete}
                  alt="delete-icon"
                  className="delete-icon"
                  onClick={() => {
                    setNoteToDelete(note);
                    setShowDeletePopup(true);
                  }}
                />
                <h4
                  className="note-title-text"
                  onClick={() => handleEditNote(note)}
                >
                  {note.title}
                </h4>
                <p className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </section>
              <p className="note-description">{note.description}</p>
            </section>
          ))}
        </section>
      )}
      {showDeletePopup && noteToDelete && (
        <Popup
          title="Delete Note"
          message={`Are you sure you want to delete "${noteToDelete.title}"?`}
          onConfirm={confirmDeleteNote}
          onCancel={() => {
            setShowDeletePopup(false);
            setNoteToDelete(null);
          }}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
      {showAddNote && (
        <section className="modal-overlay" onClick={handleCancel}>
          <section
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <AddNote onCancel={onCancel} noteToEdit={noteToEdit} />
          </section>
        </section>
      )}
    </section>
  );
};

export default NotesList;
