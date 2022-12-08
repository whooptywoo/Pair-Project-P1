const {Course} = require('../models')

class Controller {
    static home (req, res) {
        Course.findAll()
            .then(courses => res.render('home', {courses}))
            .catch(err => res.send(err))
    }

    static courseDetail (req, res) {
        Course.findByPk(req.params.id, {include: Instructor})
            .then(course => res.render('courseDetail', {course}))
            .catch(err => res.send(err))
    }
}

module.exports = Controller