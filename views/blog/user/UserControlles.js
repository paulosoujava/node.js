const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../../database/User");
const session = require("express-session");

router.get("/user",(req, res)=>{
  res.render("blog/user/create",{err:null});
});

router.post("/login",(req, res)=>{
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({
    where:{
      email: email
    }
  }).then(user=>{
    if( user ){
      var correct  = bcrypt.compareSync(password, user.password);
      if(correct){
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect("/blog");
      }else{
        res.render("blog/user/create",{err: "Ops email/senha inválidos."});
      }
      
    }else{
      res.render("blog/user/create",{err: "Ops você já realizou o cadastro?."});
    }
    
  });
  
});

router.post("/create",(req, res)=>{
  var email = req.body.email;
  var password = req.body.password;
  var r_password = req.body.r_password;
  
  if( !email || email == undefined || email == ""){
    res.render("blog/user/create",{err: "Ops todos os dados são obrigatórios."});
  }else{
    if( password != r_password){
      res.render("blog/user/create",{err: "Ops senhas não conferem."});
    }else{
     
      User.findOne({
        where:{
          email: email
        }
      }).then(user=>{
        if( user ){
          res.render("blog/user/create",{err: "Ops este ["+ email+"]  já existente."});
        }else{
              var salt = bcrypt.genSaltSync(10);
              var hash = bcrypt.hashSync(password,salt);
              //res.json({email:email, password:hash})
            
              User.create({
                email: email,
                password: hash
              }).then(()=>{
                  res.render("blog/user/create",{err: "Opa cadastrado com sucesso, você já pode fazer o login."});
              }).catch((err) =>{
                res.render("blog/user/create",{err: "Erro ao realizar o cadastro"});
              });
            }
      });
    }
  
    
  }
 
});



module.exports = router;

