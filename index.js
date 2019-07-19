var express = require('express');
var router = express.Router();
var monk=require('monk');
var moment=require('moment');
var nodemailer=require('nodemailer');
var randomstring=require('randomstring');
var multer=require('multer');

// var upload = multer({ dest: 'uploads/' })
var db=monk('localhost:27017/aditya');
// console.log('connected');
var collection=db.get('signup');
var form = db.get('form');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage })
/* GET home page. */
router.get('/', function(req, res)
{
  if(req.session && req.session.user){
    res.locals.user=req.session.user
    res.redirect('/home');
  }
  else{
    req.session.reset();
    res.render('index');
  }
});
router.get('/forgotpassword', function(req, res)
{
res.render('forgotpassword');
});
router.get('/logout',function(req,res){
  req.session.reset();
  res.redirect('/');
});
router.get('/home', function(req, res)
{
   if(req.session && req.session.user){
    res.locals.user=req.session.user
  form.find({},function(err,docs){
    console.log(docs);
    res.locals.data=docs;
res.render('home');
  });
}
else{
  // res.session.reset();
  res.redirect('/');
}
});
router.post('/forgotpwd',function(req,res){
  res.render('forgotpassword');
});
router.post('/forgotpwd',function(req,ress){
  var email=req.body.id;
  console.log(email);
  var otp=randomstring.generate(5);
  var msg="<html><head></head><body><b><c>"+otp+"</b></body></html>"
  collection.update({"email":email},{$set:{"password":otp}});
   var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chandanavelisetti@gmail.com',
    pass: 'kesava22399',
  }
});

var mailOptions = {
  from: 'chandanavelisetti@gmail.com',
  to: req.body.id,
  subject: 'thanks 4 registration',
  html:msg,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Mail not sent');
  } else {
    console.log('Email sent:');
  }
});
});
router.post('/edit',function(req,res){
  var id=req.body.y;
  form.find({"_id":id},function(err,docs){
    res.send(docs);
  });
  // res.redirect('/');
});
router.post('/update',function(req,res){
  var data={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
     email : req.body.email,
  telephone : req.body.telephone
  }
  form.update({"_id":req.body.id},{$set:data},function(err,docs){
    res.redirect('/home');
  });
});
//Form
router.post('/form',upload.single('image'), function(req,res){
  console.log(req.file);
  var data = {
    firstName : req.body.firstName,
  lastName : req.body.lastName,                       //uploads excel file
  email : req.body.email,
  telephone : req.body.telephone,
  image:req.file.originalname,
  }
  form.insert(data, function(err,docs){
    console.log(docs);
    res.redirect('/home');
  });
});
router.post('/remove',function(req,res){
var id=req.body.no;
console.log(id);
form.remove({"_id":id},function(err,docs){
res.send(docs);
});
});

router.post('/signup',function (req,res) {
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ashavelisetti@gmail.com',
    pass: 'madhavi22399',
  }
});

var mailOptions = {
  from: 'ashavelisetti@gmail.com',
  to: req.body.b,
  subject: 'thanks 4 registration',
  text: 'Your account has hacked',
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Mail not sent');
  } else {
    console.log('Email sent:');
  }
});
  var data={
    name:req.body.a,
    email:req.body.b,
    password:req.body.c,

  }
  // console.log(req.body);
  collection.insert(data,function(err,data){
    if(err){
      console.log("error");
    }
    else{
      console.log(data);

          }
    
  res.redirect("/");
  });
});
router.post('/login',function (req,res) {
  var fname=req.body.d;
  console.log(fname);
  var password=req.body.e;
  console.log(password);
  var logintime=moment().format("DD-MMM-YYYY");
  console.log(logintime);
  collection.update({"name":fname},{$set:{"logintime":logintime}})
  collection.findOne({"name":fname,"password":password},function(err,docs){
    if(!docs){
      console.log("invalid");
      res.render('index',{err:"invalid username(or)password"});

    }
    else if(docs){
      delete docs.password;
      req.session.user=docs;
      console.log("valid");
      res.redirect('/home');
    }
    else{
      console.log("error");
    }
  });
});  
module.exports = router;
