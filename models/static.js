'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Static extends Model {
        static associate(models) {

        }
    }
    Static.init({
        name_ru: DataTypes.STRING,
        name_tm: DataTypes.STRING,
        body_tm: DataTypes.STRING,
        body_ru: DataTypes.STRING
    }, {
        sequelize,
        tableName: "statics",
        modelName: 'Static',
    });
    return Static;
};