const nodemailer = require('nodemailer');

const mailer = function(email,callback)
{
    let transpoter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'image123.app@gmail.com',
            pass:'imageapp123'
        }
    });

    let mailoption={
        from:'image123.app@gmail.com',
        to: email,
        subject: 'Verification mail',
        html : "<h4>Hello"+email+",</h4><br>we are glad to have you as our customer. Please Login after the verify account.<br><a href='http://localhost:3000/customer/verifyaccount?_id="+email+"'>Click here to Verify</a><br>Thanks,Shubham Nigam"
    };

    transpoter.sendMail(mailoption,(error,info)=>{
        console.log('Mail sent');
        callback(error,info);
    });
}

module.exports={mailer : mailer};