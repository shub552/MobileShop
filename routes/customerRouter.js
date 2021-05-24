var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var database = require('../dbconfig/db');
var adminModel = require('../model/admin');
var customer = require('../model/customer');
var mailer = require('./mailerRouter');
const { request } = require('express');




const router=express.Router();
mongoose.connect(database.url,({useNewUrlParser:true,useUnifiedTopology:true}));

router.get('/',(request,response)=>{
    response.render('index.ejs',{message : ''});
});



router.get('/customerviewcategory',(request,response)=>{
    if(request.session.email)
    {
        adminModel.category.find((error,categories)=>{
            if(error)
            console.log("Error",error);
            else{
                console.log(categories);
                response.render('customerviewcategory.ejs',{categories : categories,message:'',msg:''});
            }
        });
    }
});

router.post('/login',(request,response)=>{
    var data={
        _id:request.body.email,
        password:request.body.password
    }
    console.log("Email :"+request.body.email);
    console.log("password :"+request.body.password);

    
    customer.findOne(data,(error,result)=>{
        if(error)
        console.log("Error"+error)
        else
        {
            console.log(result)
        }
        if(result)
        {
            request.session.email=request.body.email;
            request.session.save();
            response.render('customerHome',{email : request.session.email,message:result._id});
        }
        else
        {
            response.render('customer',{message:"Email or password is Wrong"});
        }
    })
});

router.post('/registration',(request,response)=>{
    var data = {
        name:request.body.name,
        _id:request.body.email,
        password:request.body.password,
        verify:"Not Verify"
    }
    console.log(data);

    customer.create(data,(error,result)=>{
        if(error)
        {

            console.log("error : ------------------ : "+error);
            response.render("index",{message:1});

        }
        else{
            mailer.mailer(request.body.email,(error,info)=>{
                if(error)
                console.log('Error'+error);
                else
                {
                    response.render('index',{message:2});
                }
            });
        }
    });
});

router.get('/verifyaccount',(request,response)=>{
    var email=request.query._id;
    customer.updateOne({_id : email},{$set : {verify : 'Verified'}},(error,result)=>{
        if(error)
        console.log('Error'+error);
        else
        response.render('index',{message : 10});
    });
});

module.exports=router;