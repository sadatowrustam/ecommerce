'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('currencies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            value: {
                type: DataTypes.REAL
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
        await queryInterface.dropTable('currencies');
    }
};