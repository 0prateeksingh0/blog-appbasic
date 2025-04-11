const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create blog
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const blog = new Blog({
      title,
      description,
      image: req.file?.path,
      author: req.user.id
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'email profileImage');
    res.json(blogs);
  } catch (err) {
    console.error('Get blogs error:', err);
    res.status(500).json({ message: 'Failed to get blogs' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'email profileImage');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Get blog error:', err);
    res.status(500).json({ message: 'Failed to get blog' });
  }
});

// Update blog
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    if (req.file) {
      blog.image = req.file.path;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ message: 'Failed to update blog' });
  }
});

// Delete blog
// Delete blog
router.delete('/:id', auth, async (req, res) => {
    try {
      console.log('Delete request received for blog ID:', req.params.id);
      console.log('User ID making request:', req.user.id);
  
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        console.log('Blog not found');
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      console.log('Blog author ID:', blog.author);
      console.log('Request user ID:', req.user.id);
  
      // Check if user is author
      if (blog.author.toString() !== req.user.id) {
        console.log('Unauthorized delete attempt');
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      await blog.deleteOne();
      console.log('Blog deleted successfully');
      res.json({ message: 'Blog deleted' });
    } catch (err) {
      console.error('Delete blog error:', err);
      res.status(500).json({ 
        message: 'Failed to delete blog',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  });

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.comments.push({ text, author: req.user.id });
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

module.exports = router;