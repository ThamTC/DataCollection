'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doalarm extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Doalarm.init({
        name: DataTypes.STRING,
        sum: DataTypes.STRING,
        checker: DataTypes.STRING,
        done_time: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Doalarm',
    });
    return Doalarm;
};