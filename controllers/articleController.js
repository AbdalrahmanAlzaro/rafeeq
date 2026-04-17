const { v4: uuidv4 } = require('uuid');
const { Article, SavedArticle, Parent } = require('../models');

const getArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({ order: [['created_at', 'DESC']] });
    const lang = req.query.lang;

    if (lang === 'en') {
      const result = articles.map((a) => ({
        id: a.id,
        title: a.title_en || a.title_ar,
        content: a.content_en || a.content_ar,
        image_url: a.image_url,
        created_at: a.created_at,
      }));
      return res.json(result);
    }

    if (lang === 'ar') {
      const result = articles.map((a) => ({
        id: a.id,
        title: a.title_ar,
        content: a.content_ar,
        image_url: a.image_url,
        created_at: a.created_at,
      }));
      return res.json(result);
    }

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title_ar, title_en, content_ar, content_en, image_url } = req.body;
    if (!title_ar || !content_ar) {
      return res.status(400).json({ message: 'title_ar and content_ar are required' });
    }

    const article = await Article.create({
      id: uuidv4(),
      title_ar,
      title_en: title_en || null,
      content_ar,
      content_en: content_en || null,
      image_url: image_url || null,
    });

    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const saveArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const existing = await SavedArticle.findOne({
      where: { user_id: req.user.id, article_id: req.params.id },
    });
    if (existing) return res.status(400).json({ message: 'Article already saved' });

    const saved = await SavedArticle.create({
      id: uuidv4(),
      user_id: req.user.id,
      article_id: req.params.id,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getSavedArticles = async (req, res) => {
  try {
    const saved = await SavedArticle.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Article, as: 'article' }],
      order: [['created_at', 'DESC']],
    });
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const unsaveArticle = async (req, res) => {
  try {
    const saved = await SavedArticle.findOne({
      where: { user_id: req.user.id, article_id: req.params.id },
    });
    if (!saved) return res.status(404).json({ message: 'Saved article not found' });

    await saved.destroy();
    res.json({ message: 'Article unsaved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getArticles, getArticle, createArticle, saveArticle, getSavedArticles, unsaveArticle };
