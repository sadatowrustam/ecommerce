'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Brands extends Model {
        static associate({ Categories, Products }) {
            this.belongsToMany(Categories, {
                through: 'Categoriesbrands',
                foreignKey: 'brandId',
                as: 'brand_categories',
            });
            this.hasMany(Products, { foreignKey: "brandId", as: "brand_products" })
        }
    }
    Brands.init({
        brand_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Brand name cannot be null",
                },
                notEmpty: {
                    msg: "Brand name cannot be empty",
                },
            },
        },

        image: DataTypes.STRING
    }, {
        sequelize,
        tableName: "brands",
        modelName: 'Brands',
    });
    return Brands;
};