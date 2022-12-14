const { Course, User, Instructor, Student, Enrollment } = require('../models')
const bcrypt = require('bcryptjs')


class Controller {
    static home(req, res) {
        Course.findAll()
            .then(courses => {
                res.render('home', { courses })
            })
            .catch(err => res.send(err))
    }

    static courseDetail(req, res) {
        const data = {}
        if (req.params.userId !== null) {
            Student.findByPk(req.params.userId, {include: Course})
                .then(student => {
                    data.student = student;
                    return Course.findByPk(+req.params.courseId, { include: Instructor })
                })
                .then(course => {
                    data.course = course
                    // res.send(data)
                    res.render('courseDetail', data)
                })
                .catch(err => res.send(err))
        } else {
            Course.findByPk(+req.params.courseId, { include: Instructor })
                .then(course => {
                    data.course = course
                    res.render('courseDetail', data)
                })
                .catch(err => res.send(err))
        }
    }

    static enrollCourse(req, res) {
        Enrollment.create({
            isDone: false,
            CourseId: +req.params.courseId,
            StudentId: +req.params.userId
        })
            .then(() => res.redirect('/:userId/:courseId/courseDetail'))
            .catch((err) => res.send(err))
    }

    static registerForm(req, res) {
        res.render('register')
    }

    static register(req, res) {
        const data = req.body
        User.create({
            email: data.email,
            password: data.password,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .then(user => {
                const id = +user.dataValues.id
                console.log(id)
                if (data.role === 'Instructor') {
                    console.log('masuk')
                    console.log(id)
                    Instructor.create({
                        name: data.name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        UserId: id
                    })
                        .then(instructor => res.redirect('/login'))
                        .catch(err => console.log(err))
                } else {
                    Student.create({
                        name: data.name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        UserId: id
                    })
                        .then(student => res.redirect('/login'))
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    }

    static loginForm(req, res) {
        const error = req.query.error
        res.render('login', { error })
    }

    static login(req, res) {
        const { email, password } = req.body

        User.findOne({ where: { email } })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)

                    if (isValidPassword) {
                        req.session.userId = user.id
                        return res.redirect(`/${user.id}`)
                    } else {
                        const error = 'Email/Password is invalid!'
                        return res.redirect(`/login?error=${error}`)
                    }
                } else {
                    const error = 'Email/Password is invalid!'
                    return res.redirect(`/login?error=${error}`)
                }
            })
            .catch(err => console.log(err))
    }


    static homeUser(req, res) {
        const data = {};
        let role = "";
        Course.findAll()
            .then(courses => {
                data.courses = courses;
                // res.send(data)
                return User.findByPk(+req.params.userId, { include: [Student, Instructor] })
            })
            .then(user => {
                // res.send(user)
                if (user.Student) {
                    role = "student"
                    return Student.findOne({ where: { UserId: +req.params.userId }, include: Course })
                } else if (user.Instructor) {
                    role = "instructor"
                    return Instructor.findOne({ where: { UserId: +req.params.userId }, include: Course })
                }
            })
            .then(user => {
                data.user = user;
                if (role === "student") {
                    const idTakenCourses = data.user.Courses.map(el => {
                        return el.id
                    })
                    data.idTakenCourses = idTakenCourses;
                    // res.send(data)
                    res.render('home-student', data)
                } else {
                    // let option = { include: Course }
                    // Report.findAll({where}, {
                    //     order: [
                    //         ["dateOfEvent", "DESC"]
                    //     ],
                    // })
                    // if (req.query.search) {
                    //     // if (byEvent) {where.event = {[Op.iLike]: `%${byEvent}%`}}
                    //     option.where = { name: [Op.iLike]}
                    // }
                    return Student.findAll({ include: Course })
                    // res.send(data)
                }
            })
            .then(students => {
                data.students = students;
                const filteredStudents = []
                const instructorCourse = data.user.Course.id
                data.students.forEach(el1 => {
                    el1.Courses.forEach(el2 => {
                        if (el2.id === instructorCourse) {
                            filteredStudents.push(el1)
                        }
                    })
                })
                data.filteredStudents = filteredStudents
                // res.send(data)
                // res.send(data.students)
                res.render('home-instructor', data)
            })
            .catch(err => {
                // console.log(err)
                res.send(err)
            }
            )
    }

    static markDone(req, res) {
        Enrollment.update({isDone: true}, {where: {
            StudentId: +req.params.studentId,
            CourseId: +req.params.courseId
        }})
        .then(() => res.redirect(`/${req.params.userId}`))
        .catch((err) => res.send(err))
    }



}
module.exports = Controller