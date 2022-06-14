'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('gifts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            gift_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            price: {
                type: DataTypes.REAL
            },
            isActive: {
                type: DataTypes.BOOLEAN
            },
            image: {
                type: DataTypes.STRING
            },
            name_tm: {
                type: DataTypes.STRING
            },
            name_ru: {
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
        await queryInterface.dropTable('gifts');
    }
};