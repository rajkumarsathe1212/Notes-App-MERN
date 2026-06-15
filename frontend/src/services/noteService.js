
import api from "./api";

// GET ALL NOTES
export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};

// GET SINGLE NOTE
export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

// CREATE NOTE
export const createNote = async (noteData) => {
  const response = await api.post("/notes", noteData);
  return response.data;
};

// UPDATE NOTE
export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

// SEARCH NOTES
export const searchNotes = async (query) => {
  const response = await api.get(`/notes/search`, {
    params: { q: query },
  });
  return response.data;
};

// GET ALL TAGS
export const getTags = async () => {
  const response = await api.get("/notes/tags");
  return response.data;
};

// TOGGLE PIN
export const togglePinNote = async (id) => {
  const response = await api.patch(`/notes/${id}/pin`);
  return response.data;
};
