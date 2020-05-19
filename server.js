const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const fun = require("./functions.js");
const app = express();
const Schema = mongoose.Schema;

const db = mongoose.connection;

const userSchema = new Schema({
  email:  String,
  nickname: String,
  cookie: String,
  availability: [String],
  platforms: [String],
  contact: [String]
});

const Model = mongoose.model('Model',userSchema);

// make all the files in '/public' available
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"),(req,res,next) => {
  req.time = new Date().toString();
  console.log(req.method + " " + req.path + " - " + req.headers["x-forwarded-for"].split(',')[0] + " " + req.time);
  next();
});

//Home page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//Authentication path - Authenticates the login
app.get("/login/:hashpw/:email", (req,res) => {
  mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
  let cookie = fun.SHA256(req.params.email+req.params.hashpw);
  Model.findOne({"email":req.params.email},(err,user)=>{
  if (err) return console.error(err);
    if(user==null){
      res.json({"Status":"Bad Login","Cookie":null});
    } else {
      let correctval = user.cookie; 
      if (cookie==correctval) {
        res.json({"Status":"Success","Cookie":cookie});
      } else {
      res.json({"Status":"Bad Login","Cookie":null});
      }
    }
  })
})

//Registration page
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

//Validation page - check if the email is unique, sends email with code and prompts for email verification code
app.post("/register/validation/:hashpw/:name/:email", (req, res) => {
  mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
  Model.findOne({"email":req.params.email},(err,user)=>{
  if (err) return console.error(err);
    if(user==null){
      fun.mailOut(req.params.email);
      res.sendFile(__dirname + "/views/validation.html");
    } else {
      res.json({"Error":"Email already exists! Please retry at https://connection-app.glitch.me/register"});
    }
  })
});

//Check page - checks if the code is correct and registers the new user in DB
app.get("/register/validation/:hashpw/:name/:email/check/:code", (req, res) => {
  mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
  Model.findOne({"email":req.params.email},(err,user)=>{
  if (err) return console.error(err);
    if(user==null){
      if(req.params.code==process.env.Code){
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
          const Doc = new Model({
            email: req.params.email,
            nickname: req.params.name,
            cookie: fun.SHA256(req.params.email+req.params.hashpw),
            availability: [""],
            platforms: [""],
            contact: [""]
          })
          Doc.save(function (err, Doc) {
            if (err) return console.error(err);
          });
        })
        res.json({"Status":"Success"});
      } else {
        res.json({"Status":"Invalid Code"});
      }
    } else {
      res.json({"Status":"Invalid attempt"});
    }
  })
});


//User page - validates if someone tries to access this page directly with the incorrect cookie
app.get("/user/:cookie", (req,res) => {
  let cookie = req.params.cookie;
  mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
  Model.findOne({"cookie":cookie},(err,user)=>{
    if (err) return console.error(err);
    if(user==null){
      res.json({"Error":"Invalid session"});
    } else {
      res.sendFile(__dirname + "/views/user-page.html")
    }
  })
})

//Update path - updates user's values in the DB and redirects back to the user page
app.post("/user/:cookie/update", (req,res,next)=>{
  //new values to be sent to DB here
  res.redirect("/user/"+req.params.cookie);
})

//Retrieval path - gets information from database to update the user page
app.get("/user/:cookie/information", (req, res) => {
  let cookie = req.params.cookie;
  mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
  Model.findOne({"cookie":cookie},(err,user)=>{
    if (err) return console.error(err);
    if(user==null){
      res.json({"Name":"Error! You are not meant to query this way!"});
    } else {
      res.json({"Name":user.nickname,"Availability":user.availability,"Platforms":user.platforms,"Contact":user.contact});
    }
  })
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
