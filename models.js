const { Sequelize, Model, DataTypes } = require("sequelize");
const path = require("path");

const connectionSettings = {
  test: { dialect: "sqlite", storage: "sqlite::memory:" },
  dev: { dialect: "sqlite", storage: path.join(__dirname, "data.db") },
  production: { dialect: "postgres", protocol: "postgres" },
};

const sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize(
        process.env.DATABASE_URL,
        connectionSettings[process.env.NODE_ENV]
      )
    : new Sequelize(connectionSettings[process.env.NODE_ENV]);

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
Friend.init();

User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = {
  User,
  Transaction,
  sequelize,
};
