const { Course, User, Instructor, Student } = require('../models')
const bcrypt = require('bcryptjs')

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
    
}
module.exports = Controller