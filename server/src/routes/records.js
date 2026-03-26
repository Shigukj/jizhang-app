const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', recordController.createRecord);
router.get('/', recordController.getRecords);
router.get('/today', recordController.getTodayRecords);
router.get('/:id', recordController.getRecordById);
router.put('/:id', recordController.updateRecord);
router.delete('/:id', recordController.deleteRecord);

module.exports = router;
