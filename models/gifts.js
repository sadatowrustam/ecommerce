'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Gifts extends Model {
        static associate(models) {}
    }
    Gifts.init({
        gift_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        price: DataTypes.REAL,
        isActive: DataTypes.BOOLEAN,
        image: DataTypes.STRING,
        name_tm: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Gift name cannot be null",
                },
                notEmpty: {
                    msg: "Gift name cannot be empty",
                },
            },
        },
        name_ru: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Gift name cannot be null",
                },
                notEmpty: {
                    msg: "Gift name cannot be empty",
                },
            },
        }
    }, {
        sequelize,
        tableName: "gifts",
        modelName: 'Gifts',
    });
    return Gifts;
};