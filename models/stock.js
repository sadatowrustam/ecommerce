'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Stock extends Model {
        static associate({ Products }) {
            this.belongsTo(Products, { foreignKey: "productId", as: "product_stock" })
        }
    }
    Stock.init({
        productId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: "stocks",
        modelName: 'Stock',
    });
    return Stock;
};