var mongoose = require('./mongo_config');
var Promise = require('bluebird');

var linkSchema = mongoose.Schema({
  url: { type: [String], index: true },
  base_url: String,
  code: { type: [String], index: true },
  title: String,
  visits: { type: [String], index: true }
},{ autoIndex: false });

exports.Link = mongoose.model('Links', linkSchema);


// var db = require('../config');
// var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;