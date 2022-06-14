'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            category_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name_tm: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Category name cannot be null",
                    },
                    notEmpty: {
                        msg: "Category name cannot be empty",
                    },
                },
            },
            name_ru: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Category name cannot be null",
                    },
                    notEmpty: {
                        msg: "Category name cannot be empty",
                    },
                },
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
        await queryInterface.dropTable('categories');
    }
};