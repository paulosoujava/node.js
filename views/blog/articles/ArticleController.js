const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const { default: slugify } = require("slugify");

router.get("/:page?", (req, res) => {
  var page = req.params.page === undefined ? 0 : req.params.page;
  var offset;
  if (isNaN(page)) {
    offset = 0;
  } else {
    offset = parseInt(page) * 4;
  }
  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [["id", "DESC"]],
    include: [{ model: Category }],
  }).then((art) => {
    var next = offset + 4 >= art.count ? false : true;
    var result = {
      next: next,
      page: page,
      articles: art,
    };
    //res.json(result);
    res.render("blog/admin/articles", { result: result });
  });
});

router.get("/create/new", (req, res) => {
  Category.findAll({
    order: [["id", "DESC"]],
  }).then((cat) => {
    res.render("blog/admin/articles/new", { categories: cat });
  });
});

router.get("/edit/:id", (req, res) => {
  var id = req.params.id;
  Article.findByPk(id).then((art) => {
    this.art = art;
    Category.findAll({
      order: [["id", "DESC"]],
    }).then((cat) => {
      res.render("blog/admin/articles/edit", {
        art: art,
        cat: cat,
        categories: cat,
      });
    });
  });
});

router.post("/edit/article", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var desc = req.body.desc;
  var catId = req.body.category;

  Article.update(
    {
      title: title,
      body: desc,
      slug: slugify(title),
    },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/blog/admin/articles");
  });
});

router.post("/create/new/save", (req, res) => {
  var title = req.body.title;
  var desc = req.body.desc;
  var catId = req.body.category;

  Article.create({
    title: title,
    body: desc,
    slug: slugify(title),
    categoryId: catId,
  }).then(() => {
    res.redirect("/blog/admin/articles");
  });
});

router.post("/delete", (req, res) => {
  var id = req.body.id;
  if (id >= 0) {
    Article.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/blog/admin/articles");
    });
  } else {
    res.redirect("/blog/admin/articles");
  }
});

router.get("/read/:slung", (req, res) => {
  var slug = req.params.slung;
  Article.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Category }],
  })
    .then((art) => {
      if (art) {
        res.render("blog/admin/articles/read", { art: art });
      } else {
        res.redirect("/blog/admin/articles");
      }
    })
    .catch((err) => {
      res.redirect("/blog/admin/articles");
    });
});

router.get("/category/:slung", (req, res) => {
  var slug = req.params.slung;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((art) => {
      if (art) {
        res.render("blog/admin/articles/list", { art: art });
      } else {
        res.redirect("/blog/admin/articles");
      }
    })
    .catch((err) => {
      res.redirect("/blog/admin/articles");
    });
});

module.exports = router;
