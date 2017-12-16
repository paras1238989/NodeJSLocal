bodyParser = require('body-parser');
var express = require("express");
var app = express();
var url=require("url");
var router = express.Router();
var path = __dirname + '/views/';
var longUrl="";
redirect = require("express-redirect");
redirect(app);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
var dict = []; // create an empty array

dict.push({
    key:1001,
    sUrl:"http://google.com/VeryLongUrl1"
},
{
    key:1002,
    sUrl:"http://google.com/VeryLongUrl2"
},
{
    key:1003,
    sUrl:"http://google.com/VeryLongUrl3"
});
//support parsing of application/json type post data
app.use(bodyParser.json());
app.set('view engine', 'html');
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/index.html",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/redirect.html",function(req,res){
  res.sendFile(path + "redirect.html");
});

var sUrl="";
router.post("/longUrl",function(req,res,next){
	longUrl=req.body.long;
	console.log(longUrl);
	if(longUrl == "www.google.com/VeryLongUrl1" ){
		sUrl="1001";
		next();
	}
	else if(longUrl == "www.google.com/VeryLongUrl2"){
		sUrl="1002";
		next();	
	}
	else if(longUrl == "www.google.com/VeryLongUrl3"){
		sUrl="1003";
		next();	
	}
	else
	{
		res.send("Please enter www.google.com/VeryLongUrl1/2/3");
	} 
});

router.get("/longUrl",function(req,res){
		res.json([{short:sUrl}]);
		sUrl="";
});

router.get("^\/[1-9][0-9][0-9][0-9]$",function(req,res){
	var path = url.parse(req.url).pathname;
	console.log(path);
	path=path.slice(1,5);
	var longUrl="";
	console.log(path);
	for(var i=0;i<dict.length;i++){
		if(path==dict[i].key){
			longUrl=dict[i].sUrl;
		}
	}
	res.redirect(longUrl);
});

app.use("/",router);
app.use("*",function(req,res){
  res.sendFile(path + "index.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});

