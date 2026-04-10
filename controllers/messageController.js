const { Message, User, Child, Notification } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { chatWithBot, summarizeSession } = require("../utils/chatbot");

const sendMessage = async (req, res) => {
  try {
    const { receiver_user_id, child_id, content, attachment_url } = req.body;

    if (!receiver_user_id || !content) {
      return res.status(400).json({
        message: "receiver_user_id and content are required",
      });
    }

    const receiver = await User.findOne({
      where: { id: receiver_user_id, is_active: true },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (child_id) {
      const child = await Child.findOne({
        where: { id: child_id, is_active: true },
      });
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
    }

    const message = await Message.create({
      sender_user_id: req.user.id,
      receiver_user_id,
      child_id: child_id || null,
      type: "chat",
      content,
      attachment_url: attachment_url || null,
      is_read: false,
      sent_at: new Date(),
    });

    await Notification.create({
      user_id: receiver_user_id,
      title_en: "New Message",
      title_ar: "رسالة جديدة",
      body_en: `You have a new message from ${req.user.name_en}.`,
      body_ar: `لديك رسالة جديدة من ${req.user.name_ar}.`,
      type: "message",
      is_read: false,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { child_id } = req.query;

    const otherUser = await User.findOne({
      where: { id: user_id, is_active: true },
    });

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { Op } = require("sequelize");

    const where = {
      type: "chat",
      [Op.or]: [
        { sender_user_id: req.user.id, receiver_user_id: user_id },
        { sender_user_id: user_id, receiver_user_id: req.user.id },
      ],
    };

    if (child_id) where.child_id = child_id;

    const messages = await Message.findAll({
      where,
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "name_en", "name_ar", "avatar_url"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "name_en", "name_ar", "avatar_url"],
        },
      ],
      order: [["sent_at", "ASC"]],
    });

    await Message.update(
      { is_read: true },
      {
        where: {
          receiver_user_id: req.user.id,
          sender_user_id: user_id,
          is_read: false,
          type: "chat",
        },
      },
    );

    return res.status(200).json({
      total: messages.length,
      messages,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const { Op, fn, col, literal } = require("sequelize");

    const messages = await Message.findAll({
      where: {
        type: "chat",
        [Op.or]: [
          { sender_user_id: req.user.id },
          { receiver_user_id: req.user.id },
        ],
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "name_en", "name_ar", "avatar_url", "role"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "name_en", "name_ar", "avatar_url", "role"],
        },
      ],
      order: [["sent_at", "DESC"]],
    });

    const conversationsMap = {};
    for (const msg of messages) {
      const otherId =
        msg.sender_user_id === req.user.id
          ? msg.receiver_user_id
          : msg.sender_user_id;

      if (!conversationsMap[otherId]) {
        const otherUser =
          msg.sender_user_id === req.user.id ? msg.Receiver : msg.Sender;

        const unreadCount = await Message.count({
          where: {
            sender_user_id: otherId,
            receiver_user_id: req.user.id,
            is_read: false,
            type: "chat",
          },
        });

        conversationsMap[otherId] = {
          user: otherUser,
          last_message: msg.content,
          last_message_at: msg.sent_at,
          unread_count: unreadCount,
        };
      }
    }

    const conversations = Object.values(conversationsMap);

    return res.status(200).json({
      total: conversations.length,
      conversations,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addTeacherNote = async (req, res) => {
  try {
    const { child_id, content, attachment_url } = req.body;

    if (!child_id || !content) {
      return res.status(400).json({
        message: "child_id and content are required",
      });
    }

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can add notes" });
    }

    const child = await Child.findOne({
      where: { id: child_id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (child.teacher_user_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only add notes for your own students",
      });
    }

    const note = await Message.create({
      sender_user_id: req.user.id,
      receiver_user_id: null,
      child_id,
      type: "note",
      content,
      attachment_url: attachment_url || null,
      is_read: false,
      sent_at: new Date(),
    });

    return res.status(201).json({
      message: "Note added successfully",
      note,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTeacherNotes = async (req, res) => {
  try {
    const { child_id } = req.params;

    const child = await Child.findOne({
      where: { id: child_id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const isTeacher = child.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const notes = await Message.findAll({
      where: {
        child_id,
        type: "note",
        sender_user_id: req.user.id,
      },
      order: [["sent_at", "DESC"]],
    });

    return res.status(200).json({
      total: notes.length,
      notes,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const chatbot = async (req, res) => {
  try {
    const { content, session_id, child_id } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const sessionId = session_id || uuidv4();

    const sessionMessages = await Message.findAll({
      where: {
        sender_user_id: req.user.id,
        type: "chatbot",
        session_id: sessionId,
      },
      order: [["sent_at", "ASC"]],
    });

    let summary = null;
    let history = [];

    if (sessionMessages.length >= 10) {
      const lastMessage = sessionMessages[sessionMessages.length - 1];
      summary = lastMessage.summary;

      if (!summary) {
        summary = await summarizeSession(
          sessionMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        );

        await Message.update(
          { summary },
          {
            where: {
              sender_user_id: req.user.id,
              type: "chatbot",
              session_id: sessionId,
            },
          },
        );
      }
    } else {
      history = sessionMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
    }

    await Message.create({
      sender_user_id: req.user.id,
      receiver_user_id: null,
      child_id: child_id || null,
      type: "chatbot",
      role: "user",
      content,
      session_id: sessionId,
      is_read: true,
      sent_at: new Date(),
    });

    const aiResponse = await chatWithBot({
      history,
      summary,
      newMessage: content,
    });

    await Message.create({
      sender_user_id: null,
      receiver_user_id: req.user.id,
      child_id: child_id || null,
      type: "chatbot",
      role: "assistant",
      content: aiResponse,
      session_id: sessionId,
      is_read: false,
      sent_at: new Date(),
    });

    return res.status(200).json({
      session_id: sessionId,
      response: aiResponse,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getChatbotHistory = async (req, res) => {
  try {
    const { session_id } = req.params;

    const messages = await Message.findAll({
      where: {
        type: "chatbot",
        session_id,
      },
      order: [["sent_at", "ASC"]],
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const firstMessage = messages.find((m) => m.sender_user_id === req.user.id);
    if (!firstMessage) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      session_id,
      total: messages.length,
      messages,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getMyChatbotSessions = async (req, res) => {
  try {
    const { Op } = require("sequelize");

    const sessions = await Message.findAll({
      where: {
        sender_user_id: req.user.id,
        type: "chatbot",
        role: "user",
      },
      attributes: ["session_id", "sent_at", "content"],
      order: [["sent_at", "DESC"]],
    });

    const sessionsMap = {};
    for (const msg of sessions) {
      if (!sessionsMap[msg.session_id]) {
        sessionsMap[msg.session_id] = {
          session_id: msg.session_id,
          started_at: msg.sent_at,
          first_message: msg.content,
        };
      }
    }

    const uniqueSessions = Object.values(sessionsMap);

    return res.status(200).json({
      total: uniqueSessions.length,
      sessions: uniqueSessions,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    await Message.update(
      { is_read: true },
      { where: { id: req.params.id, receiver_user_id: req.user.id } },
    );

    return res.status(200).json({ message: "Message marked as read" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getMyConversations,
  addTeacherNote,
  getTeacherNotes,
  chatbot,
  getChatbotHistory,
  getMyChatbotSessions,
  markMessageRead,
};
