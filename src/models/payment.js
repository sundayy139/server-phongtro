'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Payment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userFavouriteData' });
        }
    }
    Payment.init({
        userId: DataTypes.STRING,
        statusCode: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        paymentDate: DataTypes.STRING,
        paymentInfo: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Payment',
    });
    return Payment;
};