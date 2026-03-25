const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 60 }); // Cache for 60 seconds
const express = require('express');
const router = express.Router();
const { Image, Caption, User } = require('../models');
const authMiddleware = require('../middleware/auth');

// GET all images
router.get('/', async (req, res) => {
  try {
    const cachedImages = cache.get('allImages');

    if (cachedImages) {
      console.log("Serving from cache");
      return res.json(cachedImages);
    }

    const images = await Image.findAll();

    cache.set('allImages');
    cache.set('allImages', images);

    console.log("Serving from database");

    res.json(images);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// POST new image
router.post('/', async (req, res) => {
    try {
        const { title, url } = req.body;

        if (!title || !url) {
            return res.status(400).json({ error: "Title and URL are required" });
        }

        const newImage = await Image.create({ title, url });
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create image' });
    }
});

// GET single image + captions
router.get("/:id", async (req, res) => {
  try {
    const cacheKey = `image_${req.params.id}`;
    const cachedImage = cache.get(cacheKey);

    if (cachedImage) {
      console.log("Serving single image from cache");
      return res.json(cachedImage);
    }

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

    cache.set(cacheKey, image);

    console.log("Serving single image from database");

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

    cache.del('allImages'); // Invalidate all images cache
    cache.del(`image_${req.params.id}`); // Invalidate image cache

    res.status(201).json(caption);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;