'use strict'

var express = require('express')
var bcrypt = require('bcryptjs');

var dbQueryRoutes = express.Router()

var Robots = require('../models/Robot')
var Users = require('../models/User')

dbQueryRoutes.route('/login').post(function(req, res){
  Users.findOne({
    email:req.body.email
  }, function(error, user){
      if(!user){        
        res.send('No_User_Found')
      }else{
        if(bcrypt.compareSync(req.body.password, user.password)){
          //req.session.user = user;
          //res.locals.user = user;
          res.send('Login_OK');
        }else{
          res.send('Password_Error');
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
    account_type: req.body.type
  });
  user.save(function(err){
    if(err){
      var error = 'Something went wrong : ' + err;
      if(err.code === 11000){
        error = 'Email_Exists';
      }
      res.send(error);
    }else{
      res.send('Reg_OK');
    }
  })
})

// get all robots in the db
dbQueryRoutes.route('/allRobots').get(function (req, res, next) {
  Robots.find(function (err, bots) {
    if (err) {
      return next(new Error(err))
    }
    res.json(bots) // return all bots
  })
})

// create a bot
dbQueryRoutes.route('/addRobot').post(function (req, res) {
  Robots.create(
    {
      robot_name: req.body.robot_name,      
      battery_level: req.body.battery_level,
      robot_status: req.body.robot_name
    },
    function (error, bot) {
      if (error) {
        res.status(400).send('Unable to create bot list: err ' + error)
      }
      res.status(200).json(bot)
    }
  )
})

// delete a bot
dbQueryRoutes.route('/deleteRobot/:id').get(function (req, res, next) {
  var id = req.params.id
  Robots.findByIdAndRemove(id, function (err, bot) {
    if (err) {
      return next(new Error('Bot not found'))
    }
    res.json('Successfully removed')
  })
})

// perform update on a Bot
dbQueryRoutes.route('/updateRobot').post(function (req, res, next) {
  var name = req.body.name;
  Robots.find({'robot_name':name}, function(error, bot){
    if (error) {
      return next(new Error('Bot not found'))
    } else {
      //bot.robot_name = req.body.name      
      //bot.battery_level = req.body.battery_level
      bot[0].robot_status = req.body.status;
      console.log(bot[0]);
      var bbbb = bot[0];
      bbbb.save({        
        function (error, bot) {         
          if (error) {
            res.status(400).send('Unable to update Bot')
          } else {
            res.status(204).json(bot)
          }
        }
      })
    }
  })
  // Robots.findById(id, function (error, bot) {
  //   if (error) {
  //     return next(new Error('Bot not found'))
  //   } else {
  //     //bot.robot_name = req.body.name      
  //     //bot.battery_level = req.body.battery_level
  //     bot.robot_status = req.body.status

  //     bot.save({
  //       function (error, bot) {
  //         if (error) {
  //           res.status(400).send('Unable to update Bot')
  //         } else {
  //           res.status(200).json(bot)
  //         }
  //       }
  //     })
  //   }
  // })
})

module.exports = dbQueryRoutes