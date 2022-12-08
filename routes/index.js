const { application } = require('express');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/');


router.get('/', Controller.home)
// router.use('/courseDetail', require());

module.exports = router;