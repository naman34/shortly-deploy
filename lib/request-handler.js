var util = require('../lib/utility');

var User = require('../app/models/user').User;
var Link = require('../app/models/link').Link;

var isProduction = process.env.NODE_ENV === 'production';

exports.renderIndex = function(req, res) {
  res.render('index', {
    production: isProduction
  });
};

exports.signupUserForm = function(req, res) {
  res.render('signup', {
    production: isProduction
  });
};

exports.loginUserForm = function(req, res) {
  res.render('login', {
    production: isProduction
  });
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links){
    if(!!err){
      console.log(err);
      res.status(503).send("Internal server error");
    } else {
      res.send(200, links);
    }
  });

  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function(err, response){
    if(!!err){
      console.log(err);
      res.send(503);
    } else {
      if(response.length === 0){
        util.getUrlTitle(uri, function(err, title){
          if(!!err){
            console.log(err);
            return res.send(404);
          }
          Link.create({
            url: uri,
            base_url: req.headers.origin,
            title: title
          }, function(err, newLink){
            if(!!err){
              console.log(err);
              res.status(503).send("Internal server error");
            } else {
              res.send(200, newLink);
            }
          });
        });
      } else {
        res.send(200, response[0]);
      }
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var link = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });

  //       link.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findByUsernamePassword( {username: username, password: password}, function(err, response){
    if(!!err){
      console.log(err);
      res.redirect('/login');
    } else{
      if(!response){
        res.redirect('/login');
      } else {
        util.createSession(req, res, response);
      }
    }
  });

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find( { username: username }, function(err, response){
    if(!!err){
      console.log(err);
      res.status(503).send("Internal server error");
    } else {
      if (!response[0]) {
        User.create( { username: username, password: password }, function(err, user){
          if(!!err){
            console.log(err);
            res.status(503).send("Internal server error");
          } else {
            util.createSession(req, res, user);
          }
        });
      } else {
        res.redirect('/signup');
      }
    }
  });




  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           util.createSession(req, res, newUser);
  //           Users.add(newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   })
};

exports.navToLink = function(req, res) {

  Link.find( { code: req.params[0] }, function(err, link){
    if(!!err){
      console.log(err);
      res.status(503).send("Internal server error");
    } else if (!link[0]){
      res.redirect('/');
    } else {
      return res.redirect(link[0].url);
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};