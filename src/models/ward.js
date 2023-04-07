'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ward extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Ward.belongsTo(models.District, { foreignKey: 'districtCode', targetKey: 'code', as: 'districtData' });
            Ward.hasMany(models.Address, { foreignKey: 'wardCode', as: 'wardData' });
            Ward.hasMany(models.Post, { foreignKey: 'wardCode', as: 'wardPostData' });
        }
    }
    Ward.init({
        provinceCode: DataTypes.STRING,
        districtCode: DataTypes.STRING,
        code: DataTypes.STRING,
        value: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Ward',
    });
    return Ward;
};