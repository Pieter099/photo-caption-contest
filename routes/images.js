const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

const express = require('express');
const router = express.Router();

const { Image, Caption, User } = require('../models');
const authMiddleware = require('../middleware/auth');
const swaggerJSDoc = require('swagger-jsdoc');


// ==============================
// GET ALL IMAGES
// ==============================
/**
 * @swagger
 * /images:
 *   get:
 *     summary: Get all images
 *     description: Retrieve a list of all images in the system.
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Funny dog"
 *                   url:
 *                     type: string
 *                     example: "https://example.com/dog.jpg"
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const cachedImages = cache.get('allImages');

    if (cachedImages !== undefined) {
      console.log("⚡ Serving all images from cache");
      return res.json(cachedImages);
    }

    console.log("📦 Serving all images from database");

    const images = await Image.findAll();

    cache.set('allImages', images);

    res.json(images);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});


// ==============================
// POST NEW IMAGE
// ==============================
/** @swagger
 * /Images:
 *   post:
 *     summary: POST a new image
 *     description: Add a new image to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sunset at the beach"
 *               url:
 *                 type: string
 *                 example: "https://example.com/sunset.jpg"
 *     responses:
 *       201:
 *         description: Image created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const newImage = await Image.create({ title, url });

    // 🔥 Invalidate cache
    cache.del('allImages');

    res.status(201).json(newImage);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create image' });
  }
});

// ==============================
// GET SINGLE IMAGE + CAPTIONS
// ==============================
/** @swagger
 * /Images/{id}:
 *   get:
 *     summary: Get a single image
 *     description: Retrieve details of a specific image and its captions.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single image with captions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const cacheKey = `image_${req.params.id}`;
    const cachedImage = cache.get(cacheKey);

    if (cachedImage !== undefined) {
      console.log("⚡ Serving single image from cache");
      return res.json(cachedImage);
    }

    console.log("📦 Serving single image from database");

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

    const plainImage = image.toJSON();

    cache.set(cacheKey, plainImage);

    res.json(plainImage);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// ==============================
// POST CAPTION (PROTECTED)
// ==============================
/**
 * @swagger
 * /images/{id}/captions:
 *   post:
 *     summary: Post a new caption for an image
 *     description: Submit a new caption for a specific image.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This is hilarious 😂"
 *     responses:
 *       201:
 *         description: Caption created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/captions", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: "Caption text is required" });
    }

    // Check if image exists
    const image = await Image.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const caption = await Caption.create({
      text,
      userId: req.user.userId,
      imageId: req.params.id
    });

    // 🔥 Invalidate cache
    cache.del('allImages');
    cache.del(`image_${req.params.id}`);

    res.status(201).json(caption);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;