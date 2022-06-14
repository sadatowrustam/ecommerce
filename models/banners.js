'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Banners extends Model {
        static associate() {}
    }
    Banners.init({
        banner_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        link: DataTypes.STRING,
        image_tm: DataTypes.STRING,
        image_ru: DataTypes.STRING
    }, {
        sequelize,
        tableName: "banners",
        modelName: 'Banners',
    });
    return Banners;
};