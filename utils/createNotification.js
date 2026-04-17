const { Notification, NotificationType } = require('../models');

const createNotification = async (user_id, type_name, title_ar, title_en, body_ar, body_en, ref_id = null) => {
  try {
    const notifType = await NotificationType.findOne({ where: { name: type_name } });
    if (!notifType) return null;

    return await Notification.create({
      user_id,
      type_id: notifType.id,
      title_ar,
      title_en,
      body_ar,
      body_en,
      ref_id,
    });
  } catch (err) {
    console.error('createNotification error:', err.message);
    return null;
  }
};

module.exports = { createNotification };
