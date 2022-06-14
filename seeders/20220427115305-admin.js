'use strict';
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.bulkInsert(
            'admins', [{
                username: 'admin',
                password: await bcrypt.hash('admin', 12),
                createdAt: DataTypes.fn('now'),
                updatedAt: DataTypes.fn('now'),
            }, ], {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('admins', null, {});
    }
};