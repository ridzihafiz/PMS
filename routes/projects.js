var express = require('express');
var router = express.Router();
// var bodyParser = require ("body-parser");

// router.use(bodyParser.urlencoded({ extended: false }))
// router.use(bodyParser.json())

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/')
  }
}

module.exports = (pool) => {

  router.get('/', isLoggedIn, (req, res, next) => {
    res.render('projects/list', { user: req.session.user });
  });

  // =====================NAVBAR======================== \\
  router.get('/navprofile', isLoggedIn, function (req, res, next) {
    res.render('profile/view', { user: req.session.user });
  });

  router.get('/navprojects', isLoggedIn, function (req, res, next) {
    res.render('projects/list', { user: req.session.user });
  });

  // router bebas namanya dan harus sama dengan button ejs
  router.get('/add', isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file add.ejs
    res.render('projects/add', { user: req.session.user });
  });

  

  return router;
};

// module.exports = router;