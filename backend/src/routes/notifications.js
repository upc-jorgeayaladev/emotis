const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, getUnreadCount } = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.get('/', auth, getNotifications);
router.get('/unread', auth, getUnreadCount);
router.put('/read', auth, markAsRead);

module.exports = router;
