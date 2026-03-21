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

module.exports = router;