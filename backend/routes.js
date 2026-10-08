const express = require('express');
const router = express.Router();
const { User, Post } = require('./schema');

// 1. POST /users - Add a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. POST /posts - Add a new post linked to a user
router.post('/posts', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = await Post.create({
      title,
      content,
      user: userId
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. GET /posts - Retrieve all posts with populated user info
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;