'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'userId', as: 'userData' });
      User.hasMany(models.Blog, { foreignKey: 'userId', as: 'userBlogData' });
      User.hasMany(models.Payment, { foreignKey: 'userId', as: 'paymentData' });
      User.hasOne(models.Favourite, { foreignKey: 'userId', as: 'userFavouriteData' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    fbUrl: DataTypes.STRING,
    avatar: DataTypes.STRING,
    phone: DataTypes.STRING,
    zalo: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    role: DataTypes.STRING,
    statusCode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};