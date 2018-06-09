'use strict'

var express = require('express')

var dbQueryRoutes = express.Router()

var Robots = require('../models/Robot')
var Users = require('../models/User')

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
      robot_name: req.body.name,      
      battery_level: req.body.battery_level,
      robot_status: req.body.status
    },
    function (error, bot) {
      if (error) {
        res.status(400).send('Unable to create bot list')
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
dbQueryRoutes.route('/updateRobot/:id').post(function (req, res, next) {
  var id = req.params.id
  Robots.findById(id, function (error, bot) {
    if (error) {
      return next(new Error('Bot not found'))
    } else {
      bot.robot_name = req.body.name      
      bot.battery_level = req.body.battery_level
      bot.robot_status = req.body.status

      bot.save({
        function (error, bot) {
          if (error) {
            res.status(400).send('Unable to update Bot')
          } else {
            res.status(200).json(bot)
          }
        }
      })
    }
  })
})

module.exports = dbQueryRoutes