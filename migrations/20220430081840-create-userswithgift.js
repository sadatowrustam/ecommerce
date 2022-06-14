'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('userswithgifts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            phone_number: {
                type: DataTypes.STRING
            },
            expire_date: {
                type: DataTypes.STRING
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('userswithgifts');
    }
};