'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('images', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            image_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            productId: {
                type: DataTypes.INTEGER
            },
            image: {
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
        await queryInterface.dropTable('images');
    }
};