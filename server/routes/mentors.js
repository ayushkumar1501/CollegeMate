const express = require('express');
const router = express.Router();
const {
  getMentors,
  getMentor,
  createMentor,
  updateMentor,
  deleteMentor
} = require('../controllers/mentorController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getMentors);
router.get('/:id', getMentor);
router.post('/', protect, adminOnly, createMentor);
router.put('/:id', protect, adminOnly, updateMentor);
router.delete('/:id', protect, adminOnly, deleteMentor);

module.exports = router;
