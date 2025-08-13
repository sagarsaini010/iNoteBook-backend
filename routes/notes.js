const express = require('express');

const router = express.Router();

// Example route: Get all notes
router.get('/', (req, res) => {
    res.json({ message: 'Get all notes' });
});

// Example route: Add a new note
router.post('/', (req, res) => {
    res.json({ message: 'Add a new note' });
});

module.exports = router;