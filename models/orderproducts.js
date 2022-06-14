'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Orderproducts extends Model {
        static associate({ Orders }) {
            this.belongsTo(Orders, {
                foreignKey: 'orderId',
                as: 'order',
            });
        }
    }
    Orderproducts.init({
        orderproduct_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.REAL,
            allowNull: false,
        },
        price: {
            type: DataTypes.REAL,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.REAL,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'orderproducts',
        modelName: 'Orderproducts',
    });
    return Orderproducts;
};