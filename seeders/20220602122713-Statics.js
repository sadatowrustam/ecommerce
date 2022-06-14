'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.bulkInsert(
            'statics', [{
                    name_tm: "Biz barada",
                    name_ru: "О нас",
                    body_tm: "Biz barada tekst",
                    body_ru: "О нас текст",
                    createdAt: DataTypes.fn('now'),
                    updatedAt: DataTypes.fn('now'),
                },
                {
                    name_tm: "Optowiklere",
                    name_ru: "Оптовикам",
                    body_tm: "Optowiklere tekst",
                    body_ru: "Оптовикам текст",
                    createdAt: DataTypes.fn('now'),
                    updatedAt: DataTypes.fn('now'),
                },
                {
                    name_tm: "Eltip bermek hyzmaty",
                    name_ru: "Условия доставки",
                    body_tm: "Eltip bermek hyzmaty tekst",
                    body_ru: "Условия доставки текст",
                    createdAt: DataTypes.fn('now'),
                    updatedAt: DataTypes.fn('now'),
                },
                {
                    name_tm: "Ulanys duzgunleri",
                    name_ru: "Условия исползования",
                    body_tm: "Ulanys duzgunleri tekst",
                    body_ru: "Условия исползования текст",
                    createdAt: DataTypes.fn('now'),
                    updatedAt: DataTypes.fn('now'),
                },
            ], {}
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('statics', null, {});
    }
};