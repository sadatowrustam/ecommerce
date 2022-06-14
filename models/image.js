'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {

        static associate({ Products }) {
            this.belongsTo(Products, { foreignKey: "productId", as: "images" })
        }
    }
    Image.init({
        image_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        productId: DataTypes.INTEGER,
        image: DataTypes.STRING
    }, {
        sequelize,
        tableName: "images",
        modelName: 'Images',
    });
    return Image;
};