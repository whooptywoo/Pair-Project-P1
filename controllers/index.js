const { Course } = require('../models')

class Controller {
    static home(req, res) {
        Course.findAll()
            .then(courses => {
                res.render('home', courses)
            })
            .catch(err => res.send(err))
    }

    static courseDetail(req, res) {
        Course.findByPk(+req.params.courseId, { include: Instructor })
            .then(course => res.render('courseDetail', { course }))
            .catch(err => res.send(err))
    }

    static homeUser(req, res) {
        const data = {};
        User.findByPk(req.params.id, { include: [Student, Instructor] })
            .then(user => {
                data.user = user;
                if (user.Student) {
                    return Course.findAll({ include: { all: true, nested: true }})
                } else if (user.Instructor) {
                    return Course.findOne({where: {InstructorId: +req.params.id}})
                }
            })
            .then(courses => {
                data.courses = courses;
                if (user.Instructor) {
                    res.render('home-instructor', data)
                } else if (user.Student) {
                    res.render('home-student', data)
                }
            })
            .catch(err => res.send(err))
    }


}

module.exports = Controller