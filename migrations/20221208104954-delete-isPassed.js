'use strict';
const DataTypes = require('sequelize/lib/data-types')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return queryInterface.removeColumn('Courses', 'isPassed', { /* query options */ });
  },

  down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.addColumn('Courses', 'isPassed', { type: DataTypes.STRING });
  }
};
