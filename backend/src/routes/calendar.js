const express = require('express');
const router = express.Router();
const { addEvent, getEvents, updateEvent, deleteEvent, getUpcomingEvents } = require('../controllers/calendarController');
const auth = require('../middlewares/auth');

router.get('/', auth, getEvents);
router.get('/upcoming', auth, getUpcomingEvents);
router.post('/', auth, addEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
