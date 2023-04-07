'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Addresses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            provinceCode: {
                type: Sequelize.STRING
            },
            districtCode: {
                type: Sequelize.STRING
            },
            wardCode: {
                type: Sequelize.STRING
            },
            code: {
                type: Sequelize.STRING
            },
            value: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Addresses');
    }
};