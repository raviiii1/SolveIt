var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.post('/login', function (req, res, next) {
    console.log(req.body.username + " " + req.body.password);
    if (!req.body.username && !req.body.password) {
        return res.status(400).json({message: 'All fields are required.'});
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            console.log(info);
            return res.status(400).json(info);
        }
    })(req, res, next);
});

router.post('/register', function (req, res, next) {
    if (!req.body.username && !req.body.password) {
        return res.status(400).json({message: 'All fields are required.'});
    }
    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        return res.json({token: user.generateJWT()});
    });
});
module.exports = router;
