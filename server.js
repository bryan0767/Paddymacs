'use strict';

const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const body = require('body-parser')
const nodeMailer = require('nodemailer');


mongoose.connect(process.env.DB)

let signup = mongoose.Schema({
  email: String
})

let SignUp = mongoose.model('SignUp', signup)

let reservation = mongoose.Schema({
    name: String,
    size: Number,
    time: String,
    date: String
  })
let Reservation = mongoose.model('Reservation', reservation)

app.use(body.json())
app.use(body.urlencoded({extended:false}));

app.use("/src", express.static(__dirname + '/public'));

app.route('/').get(function(req,res) {
      res.sendFile(process.cwd() + '/views/index.html')
  })

app.route('/menu').get(function(req,res) {
      res.sendFile(process.cwd() + '/views/menu.html')
    })

    // app.route('/reserve').get(function(req,res) {
    //       res.sendFile(process.cwd() + '/client/public/reserve.html')
    //     })

        app.get('/api/home', function(req,res){
          console.log('yo');
          res.redirect('/')
        })

    app.get('/api/menu', function(req,res){
      console.log('yo');
      res.redirect('/menu')
    })

    // app.get('/api/reserve', function(req,res){
    //   console.log('yo');
    //   res.redirect('/reserve')
    // })

    app.get('/api/about', function(req,res){
      console.log('yo');
      res.redirect('/#about')
    })

    app.get('/api/special', function(req,res){
      console.log('yo');
      res.redirect('/#specials')
    })

app.route('/api/signup').post(function(req,res,done) {
  var email = req.body.email.toLowerCase();
     SignUp.findOne({email:email},function(err,data) {
         if(err) done(err)
         if(data) {{
           console.log('skrttttttttsteak');
           // res.json('Email Already Signed Up Thank You!')
           res.redirect('/')
         }}
         else {
           // console.log('skrtttsteak');
           console.log(data);
           let signUp = new SignUp({
           email:email
         })
         signUp.save(function(err, data) {
           if(err) done(err)
           res.redirect('/')
         })
          }
        })
      })

app.route('/api/reserve').post(function(req,res,done) {
    let rez = new Reservation({
      name: req.body.name,
      size: req.body.size,
      time: req.body.time,
      date: req.body.date,
    })

    rez.save(function(err, data) {
      if(err) done(err)
      res.redirect('/')

    })
  })

  app.route('/api/reserve').get(function(req,res, done){
    Reservation.find({},function(err, data){
      if(err) done(err)
      res.json(data)
    })
  })

app.route('/api/contact').post(function(req, res, done) {
  let transporter = nodeMailer.createTransport({
    service:"hotmail",
    auth: {
      user:"bryan224@live.com",
      pass: "leon1234"
    }
  });
  let mailOptions = {
    from:'${req.body.email}',
    to: 'bryan224@live.com',
    subject:'From Your Devoted Fans',
    text:'this is a test' + req.body.name + req.body.email + req.body.text,
    html:'<p><ol><ul>name: ' + req.body.name + '</ul><ul> Email: '+ req.body.email +'</ul><ul>Message: '+ req.body.text +'</ul></ol>',
  }

  transporter.sendMail(mailOptions, function(err, info) {
    if(err) {
      console.log(err);
      res.redirect('/')
    } else {
      console.log("message sent");
      res.redirect('/')
    }
  })
});

app.listen(port, function(){
  console.log('pepporoni pizza')
})
