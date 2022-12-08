'use strict';
const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    const instructors = JSON.parse(fs.readFileSync('./data/instructors.json','utf-8')).map(el => {
     el.createdAt = new Date();
     el.updatedAt = new Date();
     return el
    })
 
    return queryInterface.bulkInsert('Instructors', instructors);
   },
 
   down (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Instructors', null);
   }
};
