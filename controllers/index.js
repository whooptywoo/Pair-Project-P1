const { Course, User, Instructor, Student, Enrollment } = require('../models')
const bcrypt = require('bcryptjs')


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

    static registerForm(req, res){
        res.render('register')
      }
    
      static register(req, res){
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
            if(data.role === 'Instructor'){
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
    
      static loginform(req, res){
        res.render('login')
      }
    
      static login(req, res){
        const {email, password} = req.body
    
        User.findOne({where: { email }})
          .then(user => {
            if(user){
              const isValidPassword = bcrypt.compareSync(password, user.password)
    
              if(isValidPassword){
                res.redirect(`/${user.id}`)
              } else {
                res.send('gagal login')
              }
            }
          })
          .catch(err => res.send(err))
      }
    

    static homeUser(req, res) {
        const data = {};
        User.findByPk(req.params.userId, { include: [Student, Instructor] })
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