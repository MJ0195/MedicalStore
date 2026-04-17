const express = require('express');
const router = express.Router();
const { getDashboardStats, searchMedicines } = require('../controllers/adminController');
const { getUsersWithOrders } = require('../controllers/adminUserController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all admin routes with auth and admin middleware
router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.get('/medicines/search', searchMedicines);
router.get('/users', getUsersWithOrders);

module.exports = router;
