const express = require('express');

const { StatusNotFound } = require('../utils/StatusError/index');
const { login, createUser, getUser } = require('../controllers/users');
const { favoriteCard, getFavCards } = require('../controllers/cards');
const Cards = require('../models/card');

const auth = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/signin', login);
router.post('/signup', createUser);

// Routes
router.get('/users/me', auth, getUser);
router.get('/savedCards', auth, getFavCards);
router.post('/cards', auth, favoriteCard);

router.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Deleting article with ID:', id);
  if (!id) {
    return res.status(400).json({ message: 'Article ID is required' });
  }

  try {
    const deleted = await Cards.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Handle unknown routes
router.use((req, res, next) => {
  next(new StatusNotFound('The requested resource was not found'));
});

module.exports = router;
