const { application } = require('express');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/');



router.get('/', Controller.home);
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.login)
router.get('/:userId', Controller.homeUser)
router.get('/:userId/:courseId/courseDetail', Controller.courseDetail)
router.get('/:userId/:courseId/enroll', Controller.enrollCourse)
// router.get('/:courseId/:courseId/courseDetail', Controller.courseDetail)


module.exports = router;