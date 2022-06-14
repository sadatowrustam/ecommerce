'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('statics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name_tm: {
                type: DataTypes.STRING
            },
            name_ru: {
                type: DataTypes.STRING
            },
            body_tm: {
                type: DataTypes.STRING
            },
            body_ru: {
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
        await queryInterface.dropTable('statics');
    }
};