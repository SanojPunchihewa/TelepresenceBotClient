'use strict'

var express = require('express')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')

var dbQueryRoutes = express.Router()

var Robots = require('../models/Robot')
var Users = require('../models/User')
var Organizations = require('../models/Organization') 
var LastUsed = require('../models/LastUsed')
var RobotLogs = require('../models/RobotLogs')
var Notifications = require('../models/Notifications')

/*
  ----------------------------------------------------------------------
      Database Queries related to LOGIN AND REGISTRATIONS
  ----------------------------------------------------------------------
*/

dbQueryRoutes.route('/login').post(function(req, res){
  Users.findOne({
    email:req.body.email
  }, function(error, user){
      if(!user){        
        res.status(200).json('No_User_Found');       
      }else{
        if(user.account_status == 'pending'){
          res.status(200).json('Not_Approved');
        }else{
          if(bcrypt.compareSync(req.body.password, user.password)){
            var userId = user._id;
            jwt.sign({userId}, '$e(r82ke?', (err, token) => { //{ expiresIn: '30s' }
              res.status(200).json({success:true, token:token});
            });          
          }else{          
            res.status(200).json('Password_Error');
          }
        }
      }
  })
})

dbQueryRoutes.route('/register').post(function (req, res) {
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  var user = new Users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    display_name: req.body.display_name,
    email: req.body.email,
    password: hash,
    account_type: req.body.account_type,
    account_status: req.body.account_status,
    organization_id: req.body.organization_id
  });
  user.save(function(err, user){
    if(err){     
      var error;
      if(err.code === 11000){
        var field = err.message.split('index: ')[1];
        // now we have `email_1 dup key`
        field = field.split(' dup key')[0]
        field = field.substring(0, field.lastIndexOf('_')) // returns email        
        if(field == 'email'){
          error = 'Email_Exists';
        }else{
          error = 'User_Name_Exists'
        }        
      }
      res.send(error);
    }else{
      var reply = {'Status': 'Reg_OK', 'userId' : user._id};
      res.send(reply);
    }
  })
})

// perform update on a User's Organization
dbQueryRoutes.route('/updateUserOrganization').post(function (req, res, next) {
  var id = req.body.id;
  Users.update({'_id': id}, {'organization_id' : req.body.organization_id}, function(error, count, status) {
    if(error) {
      res.send(error)
    }else{
      res.send("OK")
    }
  })
})

// approve a user account status
dbQueryRoutes.route('/approveUser').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {
      var id = req.body.id;
      Users.update({'_id': id}, {'account_status' : req.body.account_status, 'account_type' : req.body.account_type}, function(error, count, status) {
        if(error) {
          res.send(error)
        }else{
          res.send("OK")
        }
      })
    }  
  })
})

// perform update on a user account status
dbQueryRoutes.route('/updateUserStatus').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {
      var id = req.body.id;
      Users.update({'_id': id}, {'account_status' : req.body.account_status}, function(error, count, status) {
        if(error) {
          res.send(error)
        }else{
          res.send("OK")
        }
      })
    }
  })
})

// update user profile info
dbQueryRoutes.route('/updateUser').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var updateData = {}; 
      if(req.body.office_phone){
        updateData['office_phone'] = req.body.office_phone
      }
      if(req.body.mobile_phone){
        updateData['mobile_phone'] = req.body.mobile_phone
      }
      var id = req.body.id;
      Users.update({'_id': id}, updateData, function(error, count, status) {
        if(error) {
          res.send(error)
        }else{
          res.send("OK")
        }
      })
    }
  })
})

// change a user's password
dbQueryRoutes.route('/updatePassword').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var id = req.body.id;
      Users.findOne({_id:id}, function(error, user){
        if(!user){        
          res.status(200).json('No_User_Found');       
        }else{        
          if(bcrypt.compareSync(req.body.old_password, user.password)){
            var hash = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10));
            Users.update({'_id': id}, {'password' : hash}, function(error, count, status) {
              if(error) {
                res.send(error)
              }else{
                res.send("OK")
              }
            })                   
          }else{          
            res.status(200).json('Password_Error');
          }        
        }
      })
    }
  })
})

dbQueryRoutes.route('/getUserById').post(verifyToken, (req, res) => {  
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      Users.findById(req.body.user_id, function(error, user){
        if(!error){
          res.status(200).json(user);
        }
      })
    }
  });
});

dbQueryRoutes.route('/getUser').post(verifyToken, (req, res) => {  
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {      
      Users.findById(authData.userId, function(error, user){
        if(!error){
          res.status(200).json(user);
        }
      })
    }
  });
});

// get all users in the db
dbQueryRoutes.route('/allUsers').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {           
      var organization_id = req.body.organization_id; 
      Users.find({'organization_id':organization_id, '_id':{$ne : authData.userId}}, function (err, users) {
        if (err) {
          return next(new Error(err))
        }
        res.json(users) // return all users
      })
    }
  });
})

// delete a user
dbQueryRoutes.route('/deleteUser').post(verifyToken, function (req, res, next) {  
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {  
      var id = req.body.id;
      Users.findOne({'_id':id, 'display_name': req.body.username}, function(error, user){
        if(!user){        
          res.status(200).json('No_User_Found');       
        }else{        
          if(bcrypt.compareSync(req.body.password, user.password)){
            Users.findByIdAndRemove(id, function (err, user) {
              if (err) {
                return next(new Error('User not found'))
              }
              res.json('OK')
            })
          }else{          
            res.status(200).json('Password_Error');
          }        
        }
      })
    }
  })
})

/*
  ----------------------------------------------------------------------
      Database Queries related to ROBOTS
  ----------------------------------------------------------------------
*/

// get all robots in the db
dbQueryRoutes.route('/allRobots').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var organization_id = req.body.organization_id;
      Robots.find({'organization_id':organization_id}, function (err, bots) {
        if (err) {
          return next(new Error(err))
        }
        res.json(bots) // return all bots
      })
    }
  }) 
})

// create a bot
dbQueryRoutes.route('/addRobot').post(verifyToken, function (req, res) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      Robots.create(
        {
          _id: req.body.robot_id,
          organization_id: req.body.organization_id,
          robot_name: req.body.robot_name,      
          battery_level: req.body.battery_level,
          robot_status: req.body.robot_status,
          //robot_uptime: req.body.robot_uptime
        },
        function (error, bot) {
          if (error) {
            res.status(400).send('Unable to create bot list: err ' + error)
          }else{
            res.status(200).json(bot)
          }      
        }
      )
    }
  })
})

// Get a Bot
dbQueryRoutes.route('/getRobot').post(verifyToken, (req, res) => {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {           
      Robots.findById(req.body.bot_id, function(error, bot){
        if(!error){
          res.status(200).json(bot);
        }
      })
    }
  });
});


// delete a bot
// dbQueryRoutes.route('/deleteRobot').post(verifyToken, function (req, res, next) {
//   jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       var id = req.body.bot_id
//       Robots.findByIdAndRemove(id, function (err, bot) {
//         if (err) {
//           return next(new Error('Bot not found'))
//         }
//         res.json('Successfully removed')
//       })
//     }
//   })
// })

//perform last used Info on a bot
dbQueryRoutes.route('/getRobotLastUsed').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var bot_id = req.body.bot_id;
      LastUsed.find({'bot_id':bot_id}).sort([['_id', -1]]).limit(10).exec(function(error, lastUsed) {
        if (error) {
          return next(new Error('Bot not found'))
        }
        res.status(200).json(lastUsed)  
      })
    }
  })
})

// create last used Info on a bot 
dbQueryRoutes.route('/updateRobotLastUsed').post(function (req, res) {
  LastUsed.create(
    {
      bot_id: req.body.bot_id,
      user_id: req.body.user_id,
      user_name: req.body.user_name
    },
    function (error, lastUsed) {
      if (error) {
        res.status(400).send('Unable to create last used stamp: err ' + error)
      }else{
        res.status(200).json(lastUsed)
      }
    }
  )
})

// check a Bot
dbQueryRoutes.route('/checkRobot').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var id = req.body.id;
      Robots.findById(id, function (error, bot) {
        if (!bot) {
          res.send('Not Found')    
        } else {
          res.send('OK')      
        }
      })
    }
  })
})

// perform Info update on a Bot
dbQueryRoutes.route('/updateRobotInfo').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {
      var id = req.body.id;
      Robots.findById(id, function (error, bot) {
        if (error) {
          return next(new Error('Bot not found'))
        } else {
          if(bot.robot_name == req.body.robot_name){
            Robots.update({'_id': id}, {'organization_id' : req.body.organization_id,
                                        'robot_status' : req.body.robot_status},
            function(error, count, status) {
              if(error) {
                res.send(error)
              }else{
                res.send("OK")
              }
            })
          }else{
            res.send('Name Mismatch')
          }
        }
      })
    }
  })
})

/*
  ----------------------------------------------------------------------
      Database Queries related to ORGANIZATION
  ----------------------------------------------------------------------
*/

// create a Organization
dbQueryRoutes.route('/addOrganization').post(function (req, res) {
  Organizations.create(
    {      
      organization_name: req.body.organization_name,   
      organization_owner_id: req.body.organization_owner_id
    },
    function (error, organization) {
      if (error) {
        res.send('Unable to create Organization: err ' + error)
      }
      let reply = {'Status' : 'OK', 'organization_id' : organization._id}
      res.json(reply)
    }
  )
})

// Get a organization info
dbQueryRoutes.route('/getOrganization').post(verifyToken, (req, res) => { 
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {           
      Organizations.findById(req.body.organization_id, function(error, organization){
        if(!error){
          res.status(200).json(organization);
        }
      })
    }
  });
});

// get all organizations in the db
// dbQueryRoutes.route('/allOrganizations').post(function (req, res, next) {
//   //var organization_id = req.body.organization_id; {'organization_id':organization_id}
//   Organizations.find(function (err, organizations) {
//     if (err) {
//       return next(new Error(err))
//     }
//     res.json(organizations) // return all
//   })
// })

// delete a organization
// dbQueryRoutes.route('/deleteOrganization').post(verifyToken, function (req, res, next) {
//   jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
//     if(err) {
//      res.sendStatus(403);
//     } else {

//     }
//   })
//   var id = req.body.organization_id
//   Organizations.findByIdAndRemove(id, function (err, user) {
//     if (err) {
//       return next(new Error('Organization not found'))
//     }
//     res.json('Successfully removed')
//   })
// })

/*
  ----------------------------------------------------------------------
      Database Queries related to NOTIFICATIONS
  ----------------------------------------------------------------------
*/

// create a notification
dbQueryRoutes.route('/addNotification').post(verifyToken, function (req, res) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      Notifications.create(
        {
          user_id: req.body.user_id,
          organization_id: req.body.organization_id,
          notification_type: req.body.notification_type,
          notification: req.body.notification,
          notification_meta: req.body.notification_meta,  
          is_read: 'false'
        },
        function (error, data) {
          if (error) {
            res.status(400).send('Unable to create notification: err ' + error)
          }
          res.status(200).json(data)
        }
      )
    }
  })
})

// get Unread notification count
dbQueryRoutes.route('/getNotificationCount').post(verifyToken, function (req, res) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      let query;
      if(req.body.organization_id){
        query = {'organization_id':req.body.organization_id, 'is_read':'false'};
      }else{
        query = {'user_id':req.body.user_id, 'is_read':'false'};
      } 
      Notifications.find(query, function (err, notifications) {
        if (err) {
          return next(new Error(err))
        }
        res.json(notifications.length) // return count
      })
    }
  })
})

// get ADMIN notifications
dbQueryRoutes.route('/getAdminNotification').post(verifyToken, function (req, res) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var organization_id = req.body.organization_id; 
      Notifications.find({'organization_id':organization_id}).sort([['_id', -1]]).exec(function (err, notifications) {
        if (err) {
          return next(new Error(err))
        }
        res.json(notifications) // return all
      })
    }
  })
})

// get USER notifications
dbQueryRoutes.route('/getUserNotification').post(verifyToken, function (req, res) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var user_id = req.body.user_id; 
      Notifications.find({'user_id':user_id}).sort([['_id', -1]]).exec(function (err, notifications) {
        if (err) {
          return next(new Error(err))
        }
        res.json(notifications) // return all
      })
    }
  })
})

// delete a notification
dbQueryRoutes.route('/deleteNotification').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var id = req.body.notification_id
      Notifications.findByIdAndRemove(id, function (err, user) {
        if (err) {
          return next(new Error('Noti not found'))
        }
        res.json('Successfully removed')
      })
    }
  })
})

// update a notification
dbQueryRoutes.route('/updateNotification').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var id = req.body.notification_id;
      Notifications.update({'_id': id}, {'is_read' : req.body.is_read},
      function(error, count, status) {
        if(error) {
          res.send("ERR")
        }else{
          res.send("OK")
        }
      })
    }
  })
})

/*
  ----------------------------------------------------------------------
      Database Queries related to LOGS
  ----------------------------------------------------------------------
*/

//perform get logs
dbQueryRoutes.route('/getRobotLog').post(verifyToken, function (req, res, next) {
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
      res.sendStatus(403);
    } else {
      var bot_id = req.body.bot_id;
      RobotLogs.find({'bot_id':bot_id}).sort([['_id', -1]]).limit(10).exec(function(error, logs) {
        if (error) {
          return next(new Error('Bot not found'))
        }
        res.status(200).json(logs)  
      })
    }
  })
})

// create a log
dbQueryRoutes.route('/updateRobotLog').post(function (req, res) {
  RobotLogs.create(
    {
      bot_id: req.body.bot_id,
      log_message: req.body.log_message,
      log_data: req.body.log_data
    },
    function (error, logs) {
      if (error) {
        res.status(400).send('Unable to create log: err ' + error)
      }else{
        res.status(200).json(logs)
      }
    }
  )
})

/*
  ----------------------------------------------------------------------
      API Queries related to Emails
  ----------------------------------------------------------------------
*/

// Send an Email notification on approval
dbQueryRoutes.route('/sendEmail').post(verifyToken, function(req, res){
  jwt.verify(req.token, '$e(r82ke?', (err, authData) => {    
    if(err) {
     res.sendStatus(403);
    } else {
      // Create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          requireTLS: true,
          auth: {
              user: 'i63oojsi4cs2xxw4@ethereal.email', 
              pass: 'fuNDPf5FRAEHNgYQ1q' 
          },
          tls: {rejectUnauthorized: false}
      });

      // Setup email data with unicode symbols
      let mailOptions = {
          from: 'no-reply@tbotwebapplication.com', // Sender address
          to: req.body.email, // List of receivers
          subject: req.body.subject,  // Subject line
          text: req.body.text // Plain text body`
      };

      // Send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          res.send('OK');
          //console.log('Email sent to:', req.body.email);
      }); 
    }
  })
})

/*
  ----------------------------------------------------------------------
      TOKEN Verifications
  ----------------------------------------------------------------------
*/

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }  
}

module.exports = dbQueryRoutes
