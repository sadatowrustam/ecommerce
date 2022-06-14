'use strict';

module.exports = {
    up: async(queryInterface, DataTypes) => {
        await queryInterface.bulkInsert(
            'currencies', [{
                value: 19.5,
                createdAt: DataTypes.fn('now'),
                updatedAt: DataTypes.fn('now'),
            }, ], {}
        );
    },

    down: async(queryInterface, DataTypes) => {
        await queryInterface.bulkDelete('currencies', null, {});
    },
};