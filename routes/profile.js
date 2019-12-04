var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');

module.exports = (pool) => {

  router.get('/navprofile', helpers.isLoggedIn, function (req, res, next) {
    res.render('profile/view', { user: req.session.user });
  });


  return router;
};

// module.exports = router;