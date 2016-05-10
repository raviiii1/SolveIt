var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/login', function (req,res,next) {
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
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
