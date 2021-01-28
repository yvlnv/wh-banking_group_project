const {Sequelize, Model, DataTypes} = require('sequelize')
const sequelize = new Sequelize("sqlite:./db.sql", {logging: false})

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
