const express = require('express');
const router = express.Router();
const { getChildTree, getTreeProgress, completeTreeItem } = require('../controllers/learningTreeController');
const auth = require('../middleware/auth');

router.get('/child/:child_id', auth, getChildTree);
router.get('/:id/progress', auth, getTreeProgress);
router.post('/:id/items/:item_id/complete', auth, completeTreeItem);

module.exports = router;
