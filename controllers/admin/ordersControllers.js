const Op = require('sequelize').Op;
const excel = require("excel4node")
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {
    Products,
    Orders,
    Orderproducts,
    Stock,
    Images
} = require('../../models');

exports.getAllOrders = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    let { keyword, status } = req.query;
    let offset = req.query.offset
    var where = {};
    if (keyword != "undefined") {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
        where = {
            [Op.or]: [{
                    user_phone: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    user_name: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
            ],
        };
    }
    if (status != "undefined") {
        where.status = status
    }
    const orders = await Orders.findAll({
        where,
        order: [
            ['updatedAt', 'DESC']
        ],
        limit,
        offset,
    });
    const count = await Orders.count()
    return res.status(201).send({ orders, count });
});

exports.getOrderProducts = catchAsync(async(req, res, next) => {
    const order = await Orders.findOne({
        where: { order_id: req.params.id },
        include: {
            model: Orderproducts,
            as: 'order_products',
        },
    });
    if (!order) {
        return next(new AppError('Order did not found with that ID', 404));
    }

    let orderProducts = [];
    for (var i = 0; i < order.order_products.length; i++) {
        const product = await Products.findOne({
            where: { product_id: order.order_products[i].productId },
            include: { model: Images, as: "images" },
            order: [
                ["images", "id", "DESC"]
            ]
        });
        if (!product)
            return next(
                new AppError(`Product did not found with your ID : ${i} `, 404)
            );
        const {
            product_id,
            product_code,
            name_tm,
            name_ru,
            name_en,
            body_tm,
            body_ru,
            price,
        } = product;
        const obj = {
            product_id,
            name_tm,
            name_ru,
            name_en,
            body_tm,
            body_ru,
            price,
            product_code,
            order_product_id: order.order_products[i].id,
            image: product.images[0].image,
            quantity: order.order_products[i].quantity,
            order_price: order.order_products[i].price,
            total_price: order.order_products[i].total_price,
        };
        orderProducts.push(obj);
    }

    return res.status(201).send({ order, orderProducts });
});

exports.changeOrderStatus = catchAsync(async(req, res, next) => {
    const order = await Orders.findOne({
        where: {
            order_id: req.params.id,
        },
        include: {
            model: Orderproducts,
            as: 'order_products',
        },
    });

    if (!order) {
        return next(new AppError('Order did not found with that ID', 404));
    }

    if (req.body.status == "canceled") {
        for (var i = 0; i < order.order_products.length; i++) {
            const product = await Products.findOne({
                where: { product_id: order.order_products[i].productId },
            });
            const stock = await Stock.findOne({ where: { productId: product.id } });
            await stock.update({
                stock_quantity: stock.stock_quantity + order.order_products[i].quantity,
            });
        }
    }
    await order.update({
        status: req.body.status,
    });

    return res.status(201).send(order);
});

exports.deleteOrderProduct = catchAsync(async(req, res, next) => {
    const orderproduct = await Orderproducts.findOne({
        where: { orderproduct_id: req.params.id },
    });

    if (!orderproduct) {

        return next(new AppError('Order Product did not found with that ID', 404));
    }

    const order = await Orders.findOne({ where: { id: orderproduct.orderId } });

    await order.update({
        total_price: order.total_price - orderproduct.total_price,
    });

    await orderproduct.destroy();

    return res.status(200).json({ msg: 'Successfully Deleted' });
});
exports.editProduct = catchAsync(async(req, res, next) => {
    const order_product = await Orderproducts.findOne({ where: { id: req.params.id } })
    if (!order_product) return next(new AppError("Order product with that id not found", 404))
    const product = await Products.findOne({ where: { product_id: order_product.productId } })
    if (!product) return next(new AppError("Product not found with that id", 404))
    const stock = await Stock.findOne({ where: { productId: product.id } })
    const order = await Orders.findOne({ where: { id: order_product.orderId } })
    if (!order) return next(new AppError("Order not found with that id", 404))

    let quantity = req.body.quantity
    let total_price
    if (quantity > order_product.quantity) {
        if (stock.quantity < quantity || stock.quantity == quantity) {
            quantity = stock.quantity
            total_price = order_product.price * quantity
            await stock.update({ quantity: 0 })
            await product.update({ isActive: false })
        } else {
            await stock.update({ quantity: stock.quantity - quantity })
            total_price = order_product.price * quantity
        }
    } else {
        total_price = order_product.price * quantity
        let clear_quantity = order_product.quantity - quantity
        await stock.update({ quantity: stock.quantity + clear_quantity })
        await product.update({ isActive: false })
    }
    let order_total_price = order.total_price - order_product.total_price + total_price
    await order_product.update({ quantity, total_price })
    await order.update({ total_price: order_total_price })
    return res.status(200).send({ order, order_product })
})
exports.deleteOrder = catchAsync(async(req, res, next) => {
    const order = await Orders.findOne({ where: { order_id: req.params.id } })
    const order_products = await Orderproducts.findOne({ where: { orderId: order.id } })
    for (let i = 0; i < order_products.length; i++) {
        await order_products[i].destroy()
    }
    await order.destroy()
    return res.status(200).send("success")
})
exports.hasabat = catchAsync(async(req, res, next) => {
    const workbook = new excel.Workbook()
    let worksheet = workbook.addWorksheet("otcot")
    var style = workbook.createStyle({
        font: {
            color: "#000000",
            size: 16,
        },
    })
    worksheet.column(1).setWidth(20)
    worksheet.column(2).setWidth(40)
    worksheet.column(3).setWidth(20)
    worksheet.column(4).setWidth(50)
    worksheet.cell(1, 1).string("Telefon belgisi").style(style)
    worksheet.cell(1, 2).string("Ady").style(style)
    worksheet.cell(1, 3).string("Umumy bahasy").style(style)
    worksheet.cell(1, 4).string("Adresi").style(style)
    worksheet.cell(1, 5).string("Status").style(style)

    const orders = await Orders.findAll({
        order: [
            ["id", "DESC"]
        ]
    });
    for (let i = 0; i < orders.length; i++) {
        worksheet.cell(i + 2, 1).string(orders[i].user_phone).style(style)
        worksheet.cell(i + 2, 2).string(orders[i].user_name).style(style)
        worksheet.cell(i + 2, 3).number(orders[i].total_price).style(style)
        worksheet.cell(i + 2, 4).string(orders[i].address).style(style)
        worksheet.cell(i + 2, 5).string(orders[i].status).style(style)
    }
    await workbook.write("./static/otcot.xlsx")
    return res.status(200).sendFile("otcot.xlsx", { root: "./static" })
})
exports.giveCheck = catchAsync(async(req, res, next) => {
    const workbook = new excel.Workbook()
    let worksheet = workbook.addWorksheet("otcot")
    var style = workbook.createStyle({
        font: {
            color: "#000000",
            size: 16,
        },
    })
    worksheet.column(1).setWidth(20)
    worksheet.column(2).setWidth(40)
    worksheet.column(3).setWidth(20)
    worksheet.column(4).setWidth(50)
    worksheet.cell(1, 1).string("Haryt ady").style(style)
    worksheet.cell(1, 2).string("Sany").style(style)
    worksheet.cell(1, 3).string("Umumy bahasy").style(style)
    const order = await Orders.findOne({
        where: { order_id: req.params.id },
        include: {
            model: Orderproducts,
            as: "order_products"
        }
    })
    for (let i = 0; i < order.order_products.length; i++) {
        const product = await Products.findOne({ where: { product_id: order.order_products[i].productId } })
        worksheet.cell(i + 2, 1).string(product.name_tm).style(style)
        worksheet.cell(i + 2, 2).number(order.order_products[i].quantity).style(style)
        worksheet.cell(i + 2, 3).number(order.order_products[i].total_price).style(style)
    }
    console.log(order.order_products.length)
    worksheet.cell(order.order_products.length + 2, 1).string("Umumy bahasy").style(style)
    worksheet.cell(order.order_products.length + 2, 2).number(order.total_price).style(style)
    await workbook.write("./static/cek.xlsx")
    return res.status(200).sendFile("cek.xlsx", { root: "./static" })
})
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};