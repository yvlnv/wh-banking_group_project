const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite:./db.sql", { logging: false });

class User extends Model {
  async getBalance() {
    this.transactions.reduce();
  }
}
User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    balance: DataTypes.FLOAT,
  },
  { sequelize }
);

// MARK: - transaction model

class Transaction extends Model {}
Transaction.init(
  {
    transactionID: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },

    sender: { type: DataTypes.STRING, allowNull: false },
    senderDomain: { type: DataTypes.STRING, allowNull: false },

    recipient: { type: DataTypes.STRING, allowNull: false },
    recipientDomain: { type: DataTypes.STRING, allowNull: false },

    amount: { type: DataTypes.FLOAT, validate: { min: 0.01 } },
  },
  { sequelize }
);

class Friend extends Model {}
Friend.init(
  {
    email: { type: DataTypes.STRING, allowNull: false },
    domain: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize }
);

// MARK: - realtionships

// transactions
User.hasMany(Transaction);
Transaction.belongsTo(User);

// friends
User.hasMany(Friend);
Friend.belongsTo(User);

module.exports = {
  User,
  Transaction,
  sequelize,
};
