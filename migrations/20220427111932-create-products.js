'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            product_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },

            name_tm: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Product name cannot be null",
                    },
                    notEmpty: {
                        msg: "Product name cannot be empty",
                    },
                },
            },
            name_ru: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Product name cannot be null",
                    },
                    notEmpty: {
                        msg: "Product name cannot be empty",
                    },
                },
            },
            body_tm: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Title cannot be null",
                    },
                    notEmpty: {
                        msg: "Title cannot be empty",
                    },
                },
            },
            body_ru: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Title cannot be null",
                    },
                    notEmpty: {
                        msg: "Title cannot be empty",
                    },
                },
            },
            price: {
                type: DataTypes.REAL
            },
            price_old: {
                type: DataTypes.REAL
            },
            price_tm: {
                type: DataTypes.REAL
            },
            price_tm_old: {
                type: DataTypes.REAL
            },
            price_usd: {
                type: DataTypes.REAL
            },
            price_usd_old: {
                type: DataTypes.REAL
            },
            discount: {
                type: DataTypes.REAL
            },
            product_code: {
                type: DataTypes.STRING,
                validate: {
                    notNull: {
                        msg: "Product code cannot be null",
                    },
                    notEmpty: {
                        msg: "Product code cannot be empty",
                    },
                },
            },
            rating: {
                type: DataTypes.REAL,
                defaultValue: 0
            },
            rating_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            isActive: {
                type: DataTypes.BOOLEAN
            },
            isNew: {
                type: DataTypes.BOOLEAN,
            },
            isAction: {
                type: DataTypes.BOOLEAN
            },
            isGift: {
                type: DataTypes.BOOLEAN
            },
            is_new_expire: {
                type: DataTypes.BIGINT
            },
            categoryId: {
                type: DataTypes.INTEGER,
            },
            subcategoryId: {
                type: DataTypes.INTEGER
            },
            brandId: {
                type: DataTypes.INTEGER
            },
            bannerId: {
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
        await queryInterface.dropTable('products');
    }
};