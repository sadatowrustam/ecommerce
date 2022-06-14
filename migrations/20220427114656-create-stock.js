'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('stocks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            stock_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            productId: {
                type: DataTypes.INTEGER
            },
            quantity: {
                type: DataTypes.INTEGER
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
        await queryInterface.dropTable('stocks');
    }
};