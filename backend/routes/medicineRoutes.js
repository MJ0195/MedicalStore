const express = require('express');
const router = express.Router();
const { getMedicines } = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMedicines);

module.exports = router;
