var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var path = require('path');
var database = require('../dbconfig/db');
var adminModel = require('../model/admin');
const customer = require('../model/customer');

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

//aDD Category
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
                   request.session.email ? response.render('adminHome.ejs',{email :request.session.email,msg:'Category Added Successfully'}) : response.redirect('/admin'); 
            else
                    request.session.email ? response.render('adminHome.ejs',{email :request.session.email,msg:'Error While Adding Category'}) : response.redirect('/admin');        
        }
    });
});

//Update Category
router.get('/adminupdatecategory/:_id',(request,response)=>{
    if(request.session.email){
    let data = {
        _id:request.params._id
    };
    adminModel.category.findOne(data,(error,result)=>{
        if(error)
        console.log("Error",error);
        else{
            if(result)
            {
                console.log(result);
            response.render('adminupdatecategory',{category : result,message:''});
         } else
            response.redirect('/admin/adminviewcategory');
        }
    });
}
else{
    response.redirect('/admin');
}
});

//Admin Update Category
router.post('/adminupdatecategory',(request,response,next)=>{
    let data={
        _id:request.body._id
    }
    let value={
     $set : { cname : request.body.category}
    };
    adminModel.category.updateOne(data,value,(error,category)=>{
        if(error)
        console.log("Error : "+error);
        else{
            if(category)
            {
                adminModel.category.find((error,category)=>{
                    if(error)
                    console.log("Error :"+error)
                    else
                    response.render('adminupdatecategory',{category:category,message:"Category updated sucesfully"});
                });
            }
        }
    });
});
//Admin Delete category
router.get('/admindeletecategory/:_id',(req,res)=>{
    if(req.session.email)
    {
    let data={
      _id : req.params._id
    };
    adminModel.category.deleteOne(data,(error,result)=>{
      if(error)
        console.log('Error : '+error);
      else
      {
          if(result.deletedCount==1)
          {
            console.log(result);
            adminModel.category.find((error,categories)=>{
              if(error)
                console.log('Error : '+error);
              else
                res.render('adminviewcategory',{categories : categories,message:'Category Deleted Successfully'});
            });
    //          res.redirect('/admin/view-category');
          }
          else
          {
            adminModel.category.find((error,categories)=>{
              if(error)
                console.log('Error : '+error);
              else
              res.render('adminviewcategory',{categories : categories,message:'Error while Deleting Category'});
            });
          }
      }
    });
    }
    else
      res.redirect('/admin');
  });
  

//Admin Add Product
router.get('/addproduct',(request,response,next)=>{
    if(request.session.email)
    {
        adminModel.category.find((error,categories)=>{
            if(error)
            console.log("Error"+error)
            else
            response.render('adminaddproduct',{categories : categories});
        });
    }
    else
    response.redirect('/admin')
});

router.post('/adminaddproduct',(request,response,next)=>{
   // console.log(request.body.myImage);
   console.log(request.files.myImage)
  //  let filename = request.files.myImage;
  
      let filename = request.files.myImage;
        console.log(filename);
        let fileName = new Date().getTime()+filename.name;
        
    let filepath = path.join(__dirname,'../public/image',fileName);

    console.log(filepath);

    filename.mv(filepath,(error)=>{
        if(error){
            console.log("Error",error)
            response.render('adminHome',{email:request.session.email,message:'',msg:"Error while Updating Product"})
        }
        else
        {
             request.body.filename=fileName;
             var data={
                 _id:new Date().getTime(),
                 cname:request.body.category,
                 pname:request.body.product,
                 price:request.body.price,
                 quantity:request.body.quantity,
                 filename:request.body.filename
             }
             adminModel.product.create(data,(error,result)=>{
                if(error)
                console.log('Error : '+error);
              else
              {
                //console.log(result);
                  if(result)
                      response.render('adminHome',{email : request.session.email,message : '',msg : 'Product Added Successfully'});
                  else
                    response.render('adminHome',{email : request.session.email,message : '',msg : 'Error while Updating Product'});
              }
             });
        }
    });
});

router.get('/viewproduct', function(req, res, next) {
    if(req.session.email)
    {
      adminModel.product.find((error,products)=>{
        if(error)
          console.log('Error : '+error);
        else
        res.render('adminviewproduct',{products : products,message:'',msg : ''});
      });
    }
     else
      res.redirect('/admin');
  });

  router.get('/deleteproduct/:_id',(req,res,next)=>{
    if(req.session.email)
    {
        let _id=req.params._id;
        let data={
          _id : _id
        };
        adminModel.product.deleteOne(data,(error,result)=>{
            if(error)
              console.log('Error : '+error);
            else
            {
              if(result.deletedCount==1)
              {
                  adminModel.product.find((error,products)=>{
                    if(error)
                      console.log('Error : '+error);
                    else
                      res.render('adminviewproduct',{products : products,message : 'Product deleted successfully',msg : ''});
                  });
              }
              else
              {
                adminModel.product.find((error,products)=>{
                  if(error)
                    console.log('Error : '+error);
                  else
                    res.render('adminviewproduct',{products : products,message : 'Error While Deleting Product',msg : ''});
                });
              }
            }
        });
    }
    else
    res.redirect('/admin');
  });
  

//Admin Register User
router.get('/adminregister',(request,response)=>{
  if(request.session.email)
  {
      customer.find((error,customer)=>{
          if(error)
          console.log("ERROR : "+error);
          else
          response.render('adminregister',{customer : customer});
      });
  }
  else
  response.redirect('/admin');
  // response.render('adminregister');
});

//Remove Customer
router.get('/deletecustomer/:email',(req,res,next)=>{
  if(req.session.email)
  {
      let email=req.params.email;
      let data={
        _id : email
     };
      customer.deleteOne(data,(error,result)=>{
          if(error)
            console.log('Error : '+error);
          else
          {
            if(result.deletedCount==1)
            {
                customer.find((error,customer)=>{
                  if(error)
                    console.log('Error : '+error);
                  else
                    res.render('adminregister',{customer : customer,message : 'Customer deleted successfully'});
                });
            }
            else
            {
              customer.find((error,customer)=>{
                if(error)
                  console.log('Error : '+error);
                else
                  res.render('adminregister',{customer : customer,message : 'Error While Deleting customer'});
              });
            }
          }
      });
  }
  else
  res.redirect('/admin');
});


router.get('/logout',(request,response)=>{
    request.session.email='';
    request.session.destroy();
    request.redirect('/admin');
});
module.exports=router;