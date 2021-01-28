const {Sequelize, Model, DataTypes} = require('sequelize')
const path = require('path')

const connectionSettings = {
    test: {dialect: 'sqlite', storage: 'sqlite::memory:'},
    dev: {dialect: 'sqlite', storage: path.join(__dirname, 'data.db')},
    production: {dialect: 'postgres', protocol: 'postgres'}
}

const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, connectionSettings[process.env.NODE_ENV])
    : new Sequelize(connectionSettings[process.env.NODE_ENV])

class User extends Model {}
User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    balance: DataTypes.FLOAT
}, {sequelize})

// class Transaction extends Model {}
// Transaction.init({
//     sender: DataTypes.STRING,
//     recipient: DataTypes.STRING,
//     amount: DataTypes.FLOAT
// }, {sequelize})

// UserTransaction = sequelize.define('user_project')
// User.belongsToMany(Transaction, { through: UserTransaction })
// Transaction.belongsToMany(User, { through: UserTransaction })

module.exports = {
    User,
    // Transaction,
    sequelize
}
