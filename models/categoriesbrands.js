'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Categoriesbrands extends Model {
        static associate(models) {}
    }
    Categoriesbrands.init({
        brandId: DataTypes.INTEGER,
        categoryId: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: "categoriesbrands",
        modelName: 'Categoriesbrands',
    });
    return Categoriesbrands;
};