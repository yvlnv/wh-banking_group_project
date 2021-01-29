const { sign } = require("jsonwebtoken");
const fs = require("fs");

class Transaction {
  constructor(amount, sender, receiver, receiverDomain) {
    this.sender = sender;
    this.senderDomain = process.env.BASE_URL;
    this.receiver = receiver;
    this.receiverDomain = receiverDomain ?? process.env.BASE_URL;
    this.amount = amount ?? 20;
  }

  createToken() {
    secret = {};

    return new Promise((res, rej) => {
      let a = sign(this, fs.readFileSync("./private-key.pem"));
      console.log(a);
      res(a);
    });
  }
}

module.exports = Transaction;
