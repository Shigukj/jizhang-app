const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/home', statisticsController.getHomeData);
router.get('/monthly', statisticsController.getMonthlySummary);
router.get('/categories', statisticsController.getCategoryStatistics);
router.get('/trends', statisticsController.getTrendStatistics);

module.exports = router;
