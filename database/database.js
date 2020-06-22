const Sequelize = require("sequelize");

const connection = new Sequelize("guiapergunta", "root", "rootroot", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
