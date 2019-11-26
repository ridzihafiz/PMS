var express = require('express');
var router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/')
  }
}

module.exports = (pool) => {

  router.get('/', isLoggedIn, (req, res, next) => {
    res.render('projects/list');
  });

  router.post('/', isLoggedIn, (req, res, next) => {
    res.redirect('/projects');
  });

  // router.get('/profile/view', isLoggedIn, function (req, res, next) {
  //   res.render('profile/view', { user: req.session.user });
  // });

  return router;
};

// module.exports = router;