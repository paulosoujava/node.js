const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const connGuiaPress = require("./database/db_guiapress");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
const session = require("express-session");
const auth = require('./views/blog/middleware/auth');

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//session
app.use(session({
  secret: "paodebatata",
  cookie:{
    maxAge: 3000000
  }
}));

// //tests
// app.get("/session",(req, res)=>{
//   req.session.user ={
//     name: "Paulo",
//     idade: 38,
//     estadocivil: "casado",
//     filhos: 2
//   } ;
//   res.send("sessao gerada");
// });
// app.get("/read",(req, res)=>{
//   res.json(req.session.user);
// })


//*********************************************
//INICIO
//*********************************************
app.get("/", function (req, res) {
  res.render("begin");
});
//*********************************************
// FIM INICIO
//*********************************************

//*********************************************
//MODULO 1
//*********************************************

connection
  .authenticate()
  .then(() => console.log("success BD PERGUTAS"))
  .catch((err) => console.log("erro DB PERGUNTA" + err));

app.get("/modulo-1", function (req, res) {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((p) => {
    res.render("modulo-1/lista", { perguntas: p });
  });
});

app.get("/save", function (req, res) {
  res.render("modulo-1/save");
});

app.post("/register", (req, res) => {
  var title = req.body.title;
  var desc = req.body.desc;

  Pergunta.create({
    titulo: title,
    descricao: desc,
  });

  res.redirect("modulo-1");
});

app.get("/delete", (req, res) => {
  Pergunta.destroy({
    where: { id: req.query.id },
  }).then(() => {
    res.send({ del: "deletado" });
  });
});
app.get("/pergunta", (req, res) => {
  var id = req.query.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((p) => {
    if (p != undefined) {
      Resposta.findAll({
        where: { perguntaId: id },
        order: [["id", "DESC"]],
      }).then((resposta) => {
        res.render("modulo-1/resposta", { pergunta: p, respostas: resposta });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.perguntaId;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect(`/pergunta?id=${perguntaId}`);
  });
});

//*********************************************
//END MODULO 1
//*********************************************

//*********************************************
// MODULO 2
//*********************************************
connGuiaPress
  .authenticate()
  .then(() => console.log("success BD GUIA PRESS"))
  .catch((err) => console.log("Erro BD GUIA PRESS" + err));

const categoriesController = require("./views/blog/categories/CategoriesController");
const articleController = require("./views/blog/articles/ArticleController");
const userController = require("./views/blog/user/UserControlles");

const user = require("./database/User");

app.use("/blog",auth, categoriesController);
app.use("/blog/admin",auth, categoriesController);
app.use("/blog/admin/articles",auth, articleController);
app.use("/", userController);

//*********************************************
//END MODULO 2
//************************************ *********

app.listen(3000, (err) => {
  if (err) {
    console.log("Ferrou");
  } else {
    console.log("Server started ");
  }
});
