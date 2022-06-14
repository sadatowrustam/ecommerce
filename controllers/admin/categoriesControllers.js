const fs = require('fs');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {
    Categories,
    Subcategories,
    Products,
    Stock,
    Brands,
    Categoriesbrands,
} = require('../../models');

exports.addCategory = catchAsync(async(req, res) => {

    const newCategory = await Categories.create(req.body);
    return res.status(201).send(newCategory);
});
exports.getAllCategories = catchAsync(async(req, res, next) => {
    const sort = req.query
    let { keyword } = req.query
    let order
    order = [
        ["id", "DESC"]
    ]
    if (sort.name == "id" && sort.bool == "true") {
        order = [
            ["id", "ASC"]
        ]
    } else if (sort.name == "id" && sort.bool == "false") {
        order = [
            ["id", "DESC"]
        ]
    } else if (sort.name == "name" && sort.bool == "true") {
        order = [
            ["name_tm", "DESC"]
        ]
    } else if (sort.name == "name" && sort.bool == "false") {
        order = [
            ["name_tm", "ASC"]
        ]
    }
    var keywordsArray = ["%%"]
    if (keyword != 'undefined') {
        keywordsArray = []
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
    }
    const categories = await Categories.findAll({
        order,
        include: {
            model: Subcategories,
            as: 'subcategories',
        },
        where: {
            name_tm: {
                [Op.like]: {
                    [Op.any]: keywordsArray,
                },
            },
        },
    });
    return res.status(200).json(categories);
})

exports.editCategory = catchAsync(async(req, res, next) => {
    const category = await Categories.findOne({
        where: { category_id: req.params.id },
    });

    if (!category)
        return next(new AppError('Category did not found with that ID', 404));

    const { name_tm, name_ru } = req.body;
    if (
        typeof name_tm !== 'string' ||
        name_tm.length < 1 ||
        typeof name_ru !== 'string' ||
        name_ru.length < 1
    )
        return next(new AppError('Invalid Credentials', 400));

    await category.update({ name_tm, name_ru });

    return res.status(200).send(category);
});

exports.deleteCategory = catchAsync(async(req, res, next) => {
    const category_id = req.params.id;
    const category = await Categories.findOne({ where: { category_id } });



    if (!category)
        return next(new AppError('Category did not found with that ID', 404));

    const products = await Products.findAll({
        where: { categoryId: [category.id] },
    });

    if (products) {
        products.forEach(async(product) => {
            if (product.image) {
                fs.unlink(
                    `public/${product.image}`,
                    function(err) {
                        if (err) throw err;
                    }
                );
            }

            await Stock.destroy({ where: { productId: [product.id] } });
            await product.destroy();
        });
    }
    await category.destroy();

    return res.status(200).send('Successfully Deleted');
});
exports.getOneCategory = catchAsync(async(req, res, next) => {
    let { category_id } = req.params
    const category = await Categories.findOne({
        where: { category_id },
        include: {
            model: Subcategories,
            as: "category_subcategories"
        }
    });
    if (!category) {
        return next(new AppError("Category not found with that id", 404))
    }
    return res.status(200).send(category)
})
exports.searchCategory = catchAsync(async(req, res, next) => {
    let { keyword } = req.query
    let keywordsArray = [];
    keyword = keyword.toLowerCase();
    keywordsArray.push('%' + keyword + '%');
    keyword = '%' + capitalize(keyword) + '%';
    keywordsArray.push(keyword);
    let categories = await Categories.findAll({
        where: {
            [Op.or]: [{
                    name_tm: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    name_ru: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },

                },
            ],
        },
    })
    return res.status(200).send(categories)
})
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};