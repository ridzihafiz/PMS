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

  // router.get('/', isLoggedIn, (req, res, next) => {
  //   res.render('projects/list');
  // });

  // router.post('/', isLoggedIn, (req, res, next) => {
  //   res.redirect('/projects');
  // });

  // router.get('/profile/view', isLoggedIn, function (req, res, next) {
  //   res.render('profile/view', { user: req.session.user });
  // });

  // router.get('/navprojects', isLoggedIn, function (req, res, next) {
  //   res.render('projects/list', { user: req.session.user });
  // });

  // router.get('/navprofile', isLoggedIn, function (req, res, next) {
  //   res.render('profile/view', { user: req.session.user });
  // });

  // router.get('/navusers', isLoggedIn, function (req, res, next) {
  //   res.render('users/users', { user: req.session.user });
  // });

  // USERS CRUD
  // router bebas namanya dan harus sama dengan button ejs
  router.get('/usersadd', isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file usersadd.ejs
    res.render('users/usersadd', { user: req.session.user });
  });

  router.get('/usersedit', isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file edit.ejs
    res.render('users/usersedit', { user: req.session.user });
  });

  router.get('/delete', isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file edit.ejs
    res.render('users/delete', { user: req.session.user });
  });

  return router;
};

// module.exports = router;