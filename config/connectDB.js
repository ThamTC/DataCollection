const { Sequelize } = require('sequelize');


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('mydatabase', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    "logging": false
});

const connectDB = async function() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const closeConnectDB = async function() {
    await sequelize.close()
}

module.exports = {
    connectDB: connectDB,
    closeConnectDB: closeConnectDB
}