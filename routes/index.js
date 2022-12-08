const { application } = require('express');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/');



router.get('/', Controller.home);
router.get('/:courseId/courseDetail', Controller.courseDetail)
// router.get('/:id')
// router.use('/courseDetail', require());

router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

router.get('/login', Controller.loginform)
router.post('/login', Controller.login)

module.exports = router;