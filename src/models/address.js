'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Address.belongsTo(models.Ward, { foreignKey: 'wardCode', targetKey: 'code', as: 'wardData' });
            Address.hasMany(models.Post, { foreignKey: 'addressCode', as: 'addressPostData' });
        }
    }
    Address.init({
        provinceCode: DataTypes.STRING,
        districtCode: DataTypes.STRING,
        wardCode: DataTypes.STRING,
        code: DataTypes.STRING,
        value: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Address',
    });
    return Address;
};