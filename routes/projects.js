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

  // router.post('/', isLoggedIn, (req, res, next) => {
  //   res.redirect('/projects', { user: req.session.user });
  // });

  // router.get('/profile/view', isLoggedIn, function (req, res, next) {
  //   res.render('profile/view', { user: req.session.user });
  // });

  return router;
};

// module.exports = router;