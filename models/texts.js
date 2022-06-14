'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Texts extends Model {

        static associate(models) {

        }
    }
    Texts.init({
        text_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name_ru: DataTypes.TEXT,
        name_tm: DataTypes.TEXT,
        body_tm: DataTypes.TEXT,
        body_ru: DataTypes.TEXT,
        link: DataTypes.TEXT
    }, {
        sequelize,
        tableName: "texts",
        modelName: 'Texts',
    });
    return Texts;
};