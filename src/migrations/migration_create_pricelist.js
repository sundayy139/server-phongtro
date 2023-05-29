'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('PriceLists', {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            title: {
                type: Sequelize.STRING
            },
            order: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('PriceLists');
    }
};