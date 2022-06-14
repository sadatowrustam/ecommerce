'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('brands', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            brand_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Brand name cannot be null",
                    },
                    notEmpty: {
                        msg: "Brand name cannot be empty",
                    },
                },
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
        await queryInterface.dropTable('brands');
    }
};