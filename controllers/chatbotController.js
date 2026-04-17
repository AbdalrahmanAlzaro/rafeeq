const { v4: uuidv4 } = require('uuid');
const { ChatbotSession, ChatbotMessage } = require('../models');
const { chatWithBot, summarizeSession } = require('../utils/chatbot');

const startSession = async (req, res) => {
  try {
    const session = await ChatbotSession.create({
      id: uuidv4(),
      user_id: req.user.id,
    });
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { session_id, content } = req.body;
    if (!session_id || !content) {
      return res.status(400).json({ message: 'session_id and content are required' });
    }

    const session = await ChatbotSession.findOne({
      where: { id: session_id, user_id: req.user.id },
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const messages = await ChatbotMessage.findAll({
      where: { session_id },
      order: [['created_at', 'ASC']],
    });

    let history = messages.map((m) => ({ role: m.role, content: m.content }));
    let summary = null;

    if (messages.length >= 10) {
      summary = await summarizeSession(history);
      history = [];
    }

    const aiResponse = await chatWithBot({ history, summary, newMessage: content });

    await ChatbotMessage.create({
      id: uuidv4(),
      session_id,
      role: 'user',
      content,
    });

    await ChatbotMessage.create({
      id: uuidv4(),
      session_id,
      role: 'assistant',
      content: aiResponse,
    });

    await session.update({ updated_at: new Date() });

    res.json({ message: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await ChatbotSession.findAll({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']],
    });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getSessionMessages = async (req, res) => {
  try {
    const session = await ChatbotSession.findOne({
      where: { id: req.params.session_id, user_id: req.user.id },
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const messages = await ChatbotMessage.findAll({
      where: { session_id: session.id },
      order: [['created_at', 'ASC']],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { startSession, sendMessage, getSessions, getSessionMessages };
