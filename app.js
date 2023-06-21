//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require('lodash');

const app = express();

const {google} = require('googleapis');
require('dotenv').config();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '-04:00';



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



// var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };



// let newTitle = "";
// let newText = "";
//
//
// let posts = [];


app.get("/", function(req, res){
  res.render('home');
});

app.get("/capstone", function(req, res){
  res.sendFile(__dirname + "/capstone.html");
});

app.get("/tutoring", function(req, res){
  res.render('tutoring');
});




const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });

        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};


app.post("/tutoring/request", function(req,res){
  var first_name = req.body.bookFirstName;
  var last_name = req.body.bookLastName;
  var email = req.body.bookEmail;
  var date = req.body.bookDate;
  var start_time = req.body.bookStart;
  var end_time = req.body.bookEnd;
  var delivery = req.body.bookDelivery;
  var course = req.body.bookCourse;
  var university = req.body.bookUniversity;
  var comments = req.body.bookComments;

  var split_date = date.split('-');
  var split_start = start_time.split(':')
  var split_end = end_time.split(':')

  console.log(first_name,email, date, start_time);

  // Email.send({
  //   Host : "smtp.elasticemail.com",
  //   Username : "carlos.restrepo.tutoring@gmail.com",
  //   Password : "B504688116700D66BE0B78EC4030781ACC8E",
  //   To : 'carlos.restrepo.tutoring@gmail.com',
  //   From : 'carlos.restrepo.tutoring@gmail.com',
  //   Subject : "Booking form",
  //   Body : 'body'
  // }).then(
  // message => alert(message)
  // );

  res.redirect('/tutoring#schedule')



  let startDateTime = split_date[0] + '-' + split_date[1] + '-' + split_date[2] + 'T' + split_start[0] + ':' + split_start[1] + ':00.000' + TIMEOFFSET;

  console.log(startDateTime);

  // let dateTime = dateTimeForCalander();

  let startDate = new Date(Date.parse(startDateTime));;

  let endDateTime = split_date[0] + '-' + split_date[1] + '-' + split_date[2] + 'T' + split_end[0] + ':' + split_end[1] + ':00.000' + TIMEOFFSET;

  let endDate = new Date(Date.parse(endDateTime));;

  //Event for Google Calendar
  let event = {
      'summary': `Pending.`,
      'start': {
          'dateTime': startDate,
          'timeZone': 'Canada/Eastern'
      },
      'end': {
          'dateTime': endDate,
          'timeZone': 'Canada/Eastern'
      },
      'visibility' : "public"
  };

  insertEvent(event)
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      });
})

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
