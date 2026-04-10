const { Notification } = require("../models");

const getMyNotifications = async (req, res) => {
  try {
    const { is_read, type } = req.query;

    const where = { user_id: req.user.id };
    if (is_read !== undefined) where.is_read = is_read === "true";
    if (type) where.type = type;

    const notifications = await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        user_id: req.user.id,
        is_read: false,
      },
    });

    return res.status(200).json({ unread_count: count });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const markOneRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({ is_read: true });

    return res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } },
    );

    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteAllRead = async (req, res) => {
  try {
    await Notification.destroy({
      where: {
        user_id: req.user.id,
        is_read: true,
      },
    });

    return res.status(200).json({ message: "All read notifications deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markOneRead,
  markAllRead,
  deleteNotification,
  deleteAllRead,
};
