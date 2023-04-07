'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Favourite extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Favourite.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userFavouriteData' });
        }
    }
    Favourite.init({
        userId: DataTypes.STRING,
        postId: DataTypes.JSON,
    }, {
        sequelize,
        modelName: 'Favourite',
    });
    return Favourite;
};