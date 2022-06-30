'use strict';
module.exports = {
    up: async(queryInterface, DataTypes) => {
        await queryInterface.createTable('chats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            chat_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            chat: {
                type: DataTypes.JSONB
            },
            user: {
                type: DataTypes.STRING
            },
            isRead: {
                type: DataTypes.STRING
            },
            lastId: {
                type: DataTypes.STRING
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    down: async(queryInterface, DataTypes) => {
        await queryInterface.dropTable('chats');
    }
};