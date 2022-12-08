'use strict';
const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    const users = JSON.parse(fs.readFileSync('./data/users.json','utf-8')).map(el => {
     el.createdAt = new Date();
     el.updatedAt = new Date();
     return el
    })
 
    return queryInterface.bulkInsert('Users', users);
   },
 
   down (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Users', null);
   }
};
