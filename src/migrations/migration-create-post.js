'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            labelCode: {
                type: Sequelize.STRING
            },
            addressCode: {
                type: Sequelize.STRING
            },
            wardCode: {
                type: Sequelize.STRING
            },
            districtCode: {
                type: Sequelize.STRING
            },
            provinceCode: {
                type: Sequelize.STRING
            },
            categoryCode: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            userId: {
                type: Sequelize.STRING
            },
            imageId: {
                type: Sequelize.STRING
            },
            priceCode: {
                type: Sequelize.STRING
            },
            acreageCode: {
                type: Sequelize.STRING
            },
            statusCode: {
                type: Sequelize.STRING
            },
            target: {
                type: Sequelize.STRING
            },
            priceNumber: {
                type: Sequelize.FLOAT
            },
            acreageNumber: {
                type: Sequelize.FLOAT
            },
            expiredAt: {
                allowNull: false,
                type: Sequelize.DATE
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
        await queryInterface.dropTable('Posts');
    }
};