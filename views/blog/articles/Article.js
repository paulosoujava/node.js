const Sequelize = require("sequelize");
const db = require("../../../database/db_guiapress");
const Category = require("../categories/Category");

const Article = db.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// 1,N
Category.hasMany(Article);
// 1 para 1 um art pertence a uma categ.
Article.belongsTo(Category);
//Article.sync({ force: false });
module.exports = Article;
