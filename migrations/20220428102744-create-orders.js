'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            order_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            total_price: {
                type: DataTypes.REAL
            },
            total_quantity: {
                type: DataTypes.INTEGER
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "User name cannot be null",
                    },
                    notEmpty: {
                        msg: "User name cannot be empty",
                    },
                },
            },
            user_phone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "User phone cannot be null",
                    },
                    notEmpty: {
                        msg: "User phone cannot be empty",
                    },
                },
            },
            payment_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Payment type cannot be null",
                    },
                    notEmpty: {
                        msg: "Payment type cannot be empty",
                    },
                },
            },
            i_take: {
                type: DataTypes.BOOLEAN
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Address cannot be null",
                    },
                    notEmpty: {
                        msg: "Address cannot be empty",
                    },
                },
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Status cannot be null",
                    },
                    notEmpty: {
                        msg: "Status cannot be empty",
                    },
                },
            },
            delivery_time: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Delivery cannot be null",
                    },
                    notEmpty: {
                        msg: "Delivery cannot be empty",
                    },
                },
            },
            note: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Note cannot be null",
                    },
                    notEmpty: {
                        msg: "Note cannot be empty",
                    },
                },
            },
            giftId: {
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
        await queryInterface.dropTable('orders');
    }
};