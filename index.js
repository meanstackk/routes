var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/aditya');
// console.log('connected');
var collection=db.get('signup');
var form = db.get('form');
/* GET home page. */
router.get('/', function(req, res)
{
res.render('index');
});
router.get('/home', function(req, res)
{
  form.find({},function(err,docs){
    console.log(docs);
    res.locals.data=docs;
res.render('home');
  });
});
router.post('/edit',function(req,res){
  var x=req.body.y;
  form.find({"_id":x},function(err,docs){
    res.send(docs);
  });
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
router.post('/form', function(req,res){
  var data = {
    firstName : req.body.firstName,
  lastName : req.body.lastName,
  email : req.body.email,
  telephone : req.body.telephone
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
  var data={
    name:req.body.name,
    email:req.body.id,
    password:req.body.pwd,

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
  var fname=req.body.a;
  console.log(fname);
  var password=req.body.b;
  console.log(password);
  collection.findOne({"name":fname,"password":password},function(err,docs){
    if(!docs){
      console.log("invalid");
      res.render('index',{err:"invalid username(or)password"});

    }
    else if(docs){
      console.log("valid");
      res.redirect('/home');
    }
    else{
      console.log("error");
    }
  });
});


module.exports = router;