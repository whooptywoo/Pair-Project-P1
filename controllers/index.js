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
        console.log(req.params.userId)
        if (req.params.userId !== null) {
            Student.findByPk(req.params.userId)
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
                res.send(data)
            })
            .catch(err => res.send(err))
        }
    }

    static enrollCourse(req, res) {
        
    }

    static registerForm(req, res) {
        res.render('register')
    }

    static register(req, res) {
        const data = req.body
        User.create({
            email: data.email,
            password: data.password,
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
        res.render('login')
    }

    static login(req, res) {
        const { email, password } = req.body;
        User.findOne({ where: { email }, include: [Student, Instructor] })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if (isValidPassword) {
                        res.redirect(`/${user.id}`)
                    } else {
                        res.send('gagal login')
                    }
                }
            })
            .catch(err => {
                res.send(err)
            })
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
                    return Instructor.findOne({ where: { UserId: +req.params.userId } })
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
                    console.log('SBSBA')
                    return Student.findAll({ include: Course })
                        .then(students => {
                            const studentsByCourse = students.map(el => {
                                if (el.Courses.Enrollment.CourseId === data.courses.id) {
                                    return el
                                }
                            })
                            data.students = studentsByCourse
                            data.courses.forEach(el => {
                                if (el.InstructorId === data.user.id) {
                                    data.courses = el
                                }
                            })
                            res.send(data)
                        })
                    // res.send(data)
                    res.render('home-instructor', data)
                }
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            }
            )
    }



}
module.exports = Controller