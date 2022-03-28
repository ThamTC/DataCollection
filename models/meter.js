'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Meter extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Meter.init({
        name: DataTypes.STRING,
        vol: DataTypes.STRING,
        amp: DataTypes.STRING,
        power: DataTypes.STRING,
        cosphi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Meter',
    });
    return Meter;
};