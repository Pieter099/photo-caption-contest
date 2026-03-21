const express = require('express');
const router = express.Router();
const { Image, Caption, User } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;