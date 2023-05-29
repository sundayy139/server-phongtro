'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Post.belongsTo(models.Image, { foreignKey: 'imageId', targetKey: 'id', as: 'imagesData' });
            Post.belongsTo(models.Address, { foreignKey: 'addressCode', targetKey: 'code', as: 'addressPostData' });
            Post.belongsTo(models.Ward, { foreignKey: 'wardCode', targetKey: 'code', as: 'wardPostData' });
            Post.belongsTo(models.District, { foreignKey: 'districtCode', targetKey: 'code', as: 'districtPostData' });
            Post.belongsTo(models.Province, { foreignKey: 'provinceCode', targetKey: 'code', as: 'provincePostData' });
            Post.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' });
            Post.belongsTo(models.Category, { foreignKey: 'categoryCode', targetKey: 'code', as: 'categoryData' });
            Post.belongsTo(models.Label, { foreignKey: 'labelCode', targetKey: 'code', as: 'labelData' });
        }
    }
    Post.init({
        title: DataTypes.STRING,
        labelCode: DataTypes.STRING,
        addressCode: DataTypes.STRING,
        wardCode: DataTypes.STRING,
        districtCode: DataTypes.STRING,
        provinceCode: DataTypes.STRING,
        categoryCode: DataTypes.STRING,
        description: DataTypes.TEXT,
        userId: DataTypes.STRING,
        imageId: DataTypes.STRING,
        priceCode: DataTypes.STRING,
        acreageCode: DataTypes.STRING,
        target: DataTypes.STRING,
        statusCode: DataTypes.STRING,
        priceNumber: DataTypes.FLOAT,
        acreageNumber: DataTypes.FLOAT,
        expiredAt: DataTypes.DATE,
        order: DataTypes.INTEGER,
        priceOrder: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};