const {Course} = require('../models')

class Controller {
    static home (req, res) {
        const data = {};
        if (req.params.id) {
            const user = Course.findByPk(id,{include: [Student, Instructor]});
            data.user = user;
        }

        Course.findAll()
            .then(courses => {
                data.courses = courses;
                res.render('home', data)})
            .catch(err => res.send(err))
    }

    static courseDetail (req, res) {
        Course.findByPk(+req.params.courseId, {include: Instructor})
            .then(course => res.render('courseDetail', {course}))
            .catch(err => res.send(err))
    }
}

module.exports = Controller