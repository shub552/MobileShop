var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var database = require('../dbconfig/db');
var adminModel = require('../model/admin');
const { request } = require('express');
//var mongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/'

const router=express.Router();
mongoose.connect(database.url,({useNewUrlParser:true,useUnifiedTopology:true}));

router.get('/',(request,response)=>{
    response.render('admin.ejs');
});

router.get('/adminHome',(request,response)=>{
    response.render('adminHome.ejs',{message:'',msg:''});
});


//Admin view Category
router.get('/adminviewcategory',(request,response,next)=>{
    if(request.session.email)
    {
        adminModel.category.find((error,categories)=>{
            if(error)
            console.log("ERROR : "+error);
            else
            response.render('adminviewcategory.ejs',{categories : categories ,message:'',msg:''});
        });
    }
    else
    response.redirect('/admin');
});


router.get('/mailsupport',(request,response)=>{
    response.render('adminMailSupport.ejs');
});


router.post('/login',(request,response)=>{
    var data={
        email:request.body.email,
        password:request.body.password
    }
    console.log('Email',request.body.email);
    console.log('password',request.body.password);


    adminModel.admin.findOne(data,(error,result)=>{
        if(error)
        console.log("ERROR",error);
        else{
            console.log(result);
        }
        if(result)
        {
            
            
                request.session.email=request.body.email;
                request.session.save();
                response.render('adminHome',{email :request.session.email,message:'',msg:''})
        }
        else
        {
            response.render('admin',{message:'Email or Password is Wrong'});
        }
    })
});


router.post('/addCategory',(request,response)=>{
    var data = {
        _id:''+new Date().getTime(),
        cname:request.body.category
    }
    console.log(data);

    adminModel.category.create(data,(error,result)=>{
        if(error)
            console.log("error: "+error);
        else{
            if(result)
                   request.session.email ? response.render('adminaddCategory',{massage:'Category Added Successfully'}) : response.redirect('/admin'); 
            else
                    request.session.email ? response.render('/adminaddCategory',{message:'Error While Adding Category'}) : request.redirect('/admin');        
        }
    });
});

router.get('/logout',(request,response)=>{
    request.session.email='';
    request.session.destroy();
    request.redirect('/admin');
});
module.exports=router;