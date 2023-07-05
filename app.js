//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require('lodash');

const app = express();



//mongodb API setup

const mongoose = require("mongoose");
const _ = require("lodash");

const user = 'carlos';
const password = 'solrak301';


const uri = "mongodb+srv://" + user + ":" + password + "@fruitsdb.rrchmxl.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true});

const bookingSchema = new mongoose.Schema({
  bookingID: Number,
  bookingDate: Date,
  sessionID: Number,
  comment: String
});

const courseSchema = new mongoose.Schema({
  courseID:Number,
  courseName: String,
  university: String
});


const sessionSchema = new mongoose.Schema({
  sessionID:Number,
  date:Date,
  startTime:Number,
  endTime:Number,
  studentID:Number,
  tutorID:Number,
  courseID:Number,
  delivery:String
});


const studentSchema = new mongoose.Schema({
  studentID:Number,
  firstName:String,
  lastName:String,
  email:String
});

const tutorSchema = new mongoose.Schema({
  tutorID:Number,
  name:String,
  email:String
});


const Booking = mongoose.model('Bookings', bookingSchema);


const Course = mongoose.model('Course', courseSchema);

const Session = mongoose.model('Session', sessionSchema);

const Student = mongoose.model('Student', studentSchema);

const Tutor = mongoose.model('Tutor', tutorSchema);

// Calendar API set up

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





// fname, lname, email){

async function updateDatabase(form_data){

  const found_student = await Student.findOne({email:form_data.email});

  var studentID = 0;

  if(found_student){
    studentID = found_student.studentID;
  }
  else{

    const studentCount = await Student.countDocuments({});
    studentID = studentCount + 1;

    const newStudent = Student({
      studentID: studentID,
      firstName: form_data.first_name,
      lastName: form_data.last_name,
      email: form_data.email
    });

    newStudent.save();
  }

  const found_course = await Course.findOne({courseName: form_data.course});

  var courseID = 0;

  if(found_course){
    courseID = found_course.courseID;
  }
  else{
    const courseCount = await Course.countDocuments({});
    courseID = courseCount + 1;

    const newCourse = Course({
      courseID: courseID,
      courseName: form_data.course,
      university: form_data.university
    });

    newCourse.save();
  }



  const sessionCount = await Session.countDocuments({});
  var sessionID = sessionCount + 1;
  console.log(form_data.delivery);

  const newSession = Session({
    sessionID: sessionID,
    date: form_data.date,
    startTime: parseInt(form_data.start_time.split(':')[0]),
    endTime: parseInt(form_data.end_time.split(':')[0]),
    studentID: studentID,
    tutorID: 1,
    courseID: courseID,
    delivery: form_data.delivery
  });

  newSession.save();

  const bookingCount = await Booking.countDocuments({});
  const bookingID = bookingCount + 1;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  const newBooking = Booking({
    bookingID: bookingID,
    bookingDate: today,
    sessionID: sessionID,
    comment: form_data.comments
  });

  newBooking.save();
}


app.post("/tutoring/request", function(req,res){

  var d = document.getElementById('bookDelivery')
  // console.log(d.options[d.selectedIndex].text);
  console.log(d.options[d.selectedIndex].text);


  const form_data = {
    first_name: req.body.bookFirstName,
    last_name : req.body.bookLastName,
    email : req.body.bookEmail,
    date : req.body.bookDate,
    start_time : req.body.bookStart,
    end_time : req.body.bookEnd,
    delivery : req.body.bookDelivery,
    course : req.body.bookCourse,
    university : req.body.bookUniversity,
    comments : req.body.bookComments
  }

  // updateDatabase(form_data);









  var split_date = form_data.date.split('-');
  var split_start = form_data.start_time.split(':')
  var split_end = form_data.end_time.split(':')

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




  let startDateTime = split_date[0] + '-' + split_date[1] + '-' + split_date[2] + 'T' + split_start[0] + ':00:00.000' + TIMEOFFSET;


  // let dateTime = dateTimeForCalander();

  let startDate = new Date(Date.parse(startDateTime));;

  let endDateTime = split_date[0] + '-' + split_date[1] + '-' + split_date[2] + 'T' + split_end[0] + ':00:00.000' + TIMEOFFSET;

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
          if( res == 1 ){
            alert("Time requested successfully. Please wait for confirmation email.")
          }
      })
      .catch((err) => {
          console.log(err);
      });


  res.redirect('/tutoring#schedule')
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










const PORT = process.env.PORT || 3000;

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
