
require('./mongo_config')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

bcrypt = Promise.promisifyAll(bcrypt);

var userSchema = new Schema({
  username: { type: [String], index: true },
  password: String
});

userSchema.pre('save', function (done) {
  bcrypt.hashAsync(this.password, null, null).bind(this)
    .then(function(hash){
      this.password = hash;
    })
    .then(done);
}, { autoIndex: false });

userSchema.statics.findByUsernamePassword = function (obj, cb) {
  this.findOne({ username: obj.username }, function(err, user){
    if(!!err){
      cb(err);
    } else {
      bcrypt.compareAsync(obj.password, user.password)
        .then(function(match){
          if(match){
            cb(null, user);
          } else {
            cb(null, null);
          }
        }).caught(cb);
    }
  });
};

var User;

exports.User =  User = mongoose.model('Users', userSchema);

//setTimeout(function(){
  // var newUser = new User({ username: 'a', password: 'a'});
  User.create({username:'a', password: 'a'}, function(err, res){
    console.log("SAVING>>>", err, res);
  });

  User.find({}, function(err, res){
      console.log("FINDING>>>", err, res);
    })
  console.log("something...");
  //}, 2000);

// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;