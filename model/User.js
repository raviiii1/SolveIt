var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email: {type:String, required:true, unique:true},
    batch: {type:Number, required:true},
    course: {type:String, required:true},
    branch: {type:String, required:true},
    username : {type:String, required:true, unique:true},
    isAdmin : {type:Boolean, required:true},
    hash : String,
    salt : String
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString();
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha1').toString('hex');
  };

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha1').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate()+60);

    return jwt.sign({
        _id:this._id,
        username : this.username,
        exp : parseInt(exp.getTime()/1000)
    }, 'SECRET');
};

mongoose.model('User', UserSchema);
