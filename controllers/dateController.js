const { Products } = require("../models")
const { Op } = require("sequelize")
const schedule = require("node-schedule")
const fs = require("fs")
const dates = schedule.scheduleJob('0 19 15 * * *', async function() {
    var expiration_days = fs.readFileSync('test.txt', 'utf8')
    let today = new Date().getTime()
    let expiration_time_ms = Number(expiration_days) * 86400 * 1000
    let expiration_time = today - expiration_time_ms
    let products = await Products.findAll({
        where: {
            is_new_expire: {
                [Op.lt]: expiration_time
            },
            isNew: true
        }
    })
    for (const product of products) {
        product.update({ isNew: false })
        console.log(`Product with id: ${product.product_id} is not new product now`)
    }
});
module.exports = () => { dates }