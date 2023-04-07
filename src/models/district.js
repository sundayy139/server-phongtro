'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class District extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            District.belongsTo(models.Province, { foreignKey: 'provinceCode', targetKey: 'code', as: 'provinceData' });
            District.hasMany(models.Ward, { foreignKey: 'districtCode', as: 'districtData' });
            District.hasMany(models.Post, { foreignKey: 'districtCode', as: 'districtPostData' });
        }
    }
    District.init({
        provinceCode: DataTypes.STRING,
        code: DataTypes.STRING,
        value: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'District',
    });
    return District;
};