'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            paymentDate: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            paymentInfo: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            statusCode: {
                type: Sequelize.STRING,
                allowNull: false,
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
        await queryInterface.dropTable('Payments');
    }
};