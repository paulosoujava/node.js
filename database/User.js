const Sequelize = require("sequelize");
const db = require("./db_guiapress");

const User = db.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.sync({ force: false });

module.exports = User;
