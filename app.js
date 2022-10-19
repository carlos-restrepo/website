//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// let newTitle = "";
// let newText = "";
//
//
// let posts = [];


app.get("/", function(req, res){
  res.render('home');
});

app.get("/resume", function(req, res){
  res.render('resume');
});

app.get("/tutoring", function(req, res){
  res.render('tutoring');
});

// app.post("/", function(req, res){
//   const post = {
//     title:req.body.newTitle,
//     body:req.body.content,
//     postLink: "/posts/" + _.lowerCase(req.body.newTitle)
//   }
//   posts.push(post);
//   res.redirect("/");
// });












app.listen(3000, function() {
  console.log("Server started on port 3000");
});



//
// app.get("/about", function(req, res){
//   res.render('about', {text: aboutContent, title:'About'});
// });
//
// app.get("/contact", function(req, res){
//   res.render('contact', {text: contactContent, title:'Contact'});
// });
//
// app.get("/compose", function(req, res){
//   res.render('compose');
// });
//
// app.get("/posts/:postName", function(req, res){
//   posts.forEach(function(post){
//     console.log(_.lowerCase(post.title), _.lowerCase(req.params.postName));
//     if(_.lowerCase(post.title) === _.lowerCase(req.params.postName)){
//       console.log('Match Found');
//       res.render('about', {text: post.body, title:post.title})
//     }
//
//   });
//   console.log('404');
//
// });
