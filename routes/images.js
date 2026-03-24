const express = require('express');
const router = express.Router();
const { Image, Caption, User } = require('../models');
const authMiddleware = require('../middleware/auth');

// GET all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// GET single image + captions
router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id, {
      include: [
        {
          model: Caption,
          include: [User]
        }
      ]
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// POST caption (protected)
router.post("/:id/captions", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    // 🔥 Validate text
    if (!text) {
      return res.status(400).json({ error: "Caption text is required" });
    }

    // 🔥 Check if image exists
    const image = await Image.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const caption = await Caption.create({
      text,
      userId: req.user.userId, // ✅ FIXED
      imageId: req.params.id
    });

    res.status(201).json(caption);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;