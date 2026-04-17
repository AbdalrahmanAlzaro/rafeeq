const express = require('express');
const router = express.Router();
const {
  getArticles, getArticle, createArticle, saveArticle, getSavedArticles, unsaveArticle,
} = require('../controllers/articleController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const isParent = require('../middleware/isParent');

router.get('/', getArticles);
router.get('/saved', auth, isParent, getSavedArticles);
router.get('/:id', getArticle);
router.post('/', auth, isAdmin, createArticle);
router.post('/:id/save', auth, isParent, saveArticle);
router.delete('/:id/save', auth, isParent, unsaveArticle);

module.exports = router;
