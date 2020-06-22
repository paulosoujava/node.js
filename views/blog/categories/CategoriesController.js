const express = require("express");
const router = express.Router();
const Article = require("../articles/Article");
const Category = require("./Category");
const slugify = require("slugify");

router.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    include: [{ model: Category }],
  }).then((art) => {
    Category.findAll({
      order: [["id", "DESC"]],
    }).then((cat) => {
      //res.json({ art: art, cat: cat })
      res.render("blog/index", { art: art, cat: cat });
    });
  });
});

router.get("/admin/logout", (req, res) => {
  //res.json({ oi: 'sim'})
  if( req.session.user)
    req.session.user = null;
  res.redirect("/blog/user");
});

router.get("/admin", (req, res) => {
  res.render("blog/admin/adm");

  Article.findAll({
    order: [["id", "DESC"]],
    include: [{ model: Category }],
  }).then((art) => {
    res.render("blog/admin/adm", { art: art });
  });
});

router.get("/new", (req, res) => {
  res.render("blog/admin/categories/new");
});

router.post("/save", (req, res) => {
  var title = req.body.title;
  if (title) {
    Category.create({
      title: title,
      slug: slugify(title).toLowerCase(),
    })
      .then(() => {
        res.redirect("/blog/admin/categories");
      })
      .catch((err) => console.log("test " + err));
  } else {
    res.redirect("/blog/admin/categories");
  }
});

router.get("/admin/categories", (req, res) => {
  Category.findAll({
    order: [["id", "DESC"]],
  }).then((cat) => {
    res.render("blog/admin/categories/", { categories: cat });
  });
});

router.post("/delete", (req, res) => {
  var id = req.body.id;
  if (id >= 0) {
    Category.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/blog/admin/categories");
    });
  } else {
    res.redirect("/blog/admin/categories");
  }
});

router.get("/admin/categories/edit/:id?", (req, res) => {
  var id = req.params.id;
  Category.findByPk(id)
    .then((cat) => {
      if (!isNaN(id) || id) {
        res.render("blog/admin/categories/edit", { cat: cat });
      } else {
        res.redirect("/blog/admin/categories");
      }
    })
    .catch((err) => {
      res.redirect("/blog/admin/categories");
    });
});

router.post("/admin/categories/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  Category.update(
    {
      title: title,
      slug: slugify(title).toLowerCase(),
    },
    { where: { id: id } }
  ).then(() => {
    res.redirect("/blog/admin/categories");
  });
});

module.exports = router;
