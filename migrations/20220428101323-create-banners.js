'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('banners', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            banner_id: {
                type: DataTypes.UUID
            },
            link: {
                type: DataTypes.STRING
            },
            image_tm: {
                type: DataTypes.STRING
            },
            image_ru: {
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
        await queryInterface.dropTable('banners');
    }
};