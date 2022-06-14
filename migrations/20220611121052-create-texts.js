'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('texts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            text_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name_ru: {
                type: DataTypes.TEXT
            },
            name_tm: {
                type: DataTypes.TEXT
            },
            body_tm: {
                type: DataTypes.TEXT
            },
            body_ru: {
                type: DataTypes.TEXT
            },
            link: {
                type: DataTypes.TEXT
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
        await queryInterface.dropTable('texts');
    }
};