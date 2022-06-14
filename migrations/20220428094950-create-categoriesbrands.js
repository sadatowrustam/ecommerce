'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('categoriesbrands', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            brandId: {
                type: Sequelize.INTEGER
            },
            categoryId: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('categoriesbrands');
    }
};