const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
// In a real app, 'updateConfig' would be protected by admin middleware
router.get('/', getConfig);
router.get('/live', (req,res)=>{
    res.send("hello")
});
router.post('/', updateConfig);
module.exports = router;