const { application } = require('express');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/');


router.get('/', Controller.home);
router.get('/:courseId/courseDetail', Controller.courseDetail)
// router.get('/:id')
// router.use('/courseDetail', require());

module.exports = router;