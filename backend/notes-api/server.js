const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/Note');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-db')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Routes

// GET all notes (sorted by most recently updated, then pinned first)
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find()
      .sort({ isPinned: -1, updatedAt: -1 })
      .exec();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes', details: error.message });
  }
});

// SEARCH notes by title and content
app.get('/api/notes/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    
    if (!query.trim()) {
      const notes = await Note.find()
        .sort({ isPinned: -1, updatedAt: -1 })
        .exec();
      return res.json(notes);
    }

    const searchRegex = new RegExp(query, 'i');
    const notes = await Note.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    })
    .sort({ isPinned: -1, updatedAt: -1 })
    .exec();

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

// CREATE a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = new Note({
      title: title.trim(),
      content: content || '',
      tags: Array.isArray(tags) ? tags.filter(t => t.trim()).map(t => t.trim()) : [],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note', details: error.message });
  }
});

// GET a single note by ID
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note', details: error.message });
  }
});

// UPDATE a note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content, isPinned, tags } = req.body;

    // Validation
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (tags !== undefined) note.tags = Array.isArray(tags) ? tags.filter(t => t.trim()).map(t => t.trim()) : [];
    note.updatedAt = new Date();

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note', details: error.message });
  }
});

// DELETE a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note', details: error.message });
  }
});

// GET all unique tags
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Note.distinct('tags');
    res.json(tags.sort());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags', details: error.message });
  }
});

// FILTER notes by tags
app.get('/api/notes/filter/bytag', async (req, res) => {
  try {
    const tag = req.query.tag;
    
    if (!tag || tag.trim() === '') {
      const notes = await Note.find()
        .sort({ isPinned: -1, updatedAt: -1 })
        .exec();
      return res.json(notes);
    }

    const notes = await Note.find({
      tags: { $in: [tag] }
    })
    .sort({ isPinned: -1, updatedAt: -1 })
    .exec();

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter notes', details: error.message });
  }
});

// PIN/UNPIN a note
app.patch('/api/notes/:id/pin', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    note.updatedAt = new Date();
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to pin/unpin note', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/notes`);
});
