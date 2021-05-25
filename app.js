var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var path = require('path');
var expressSession = require('express-session');
var customerRouter = require('./routes/customerRouter');
var adminRouter = require('./routes/adminRouter');
const bodyParser = require('body-parser');


var app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'public/views'));
app.use(express.static(path.join(__dirname,'assets')));
console.log(__dirname);

app.use(expressSession({secret : 'shub',resave:true,saveUninitialized:true}));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/customer',customerRouter);
app.use('/admin',adminRouter);

app.listen(4000,()=>{
    console.log('Server Running..!!!');
});
