'use strict';

var config = require('../config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../model/user/user-schema');

var validateJwt = expressJwt({
  secret: config.secrets.session
});

module.exports = {
  /**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
  isAuthenticated: function () {
    return compose()
      // Validate jwt
      .use(function (req, res, next) {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = `Bearer ${req.query.access_token}`;
        }
        // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
        if (req.query && typeof req.headers.authorization === 'undefined') {
          req.headers.authorization = `Bearer ${req.cookies.token}`;
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function (req, res, next) {
        User.findById(req.user._id).exec()
          .then(user => {
            if (!user) {
              return res.status(401).end();
            }
            req.user = user;
            next();
          })
          .catch(err => next(err));
      });
  },

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  hasRole: function (roleRequired) {
    if (!roleRequired) {
      throw new Error('Required role needs to be set');
    }

    return compose()
      .use(this.isAuthenticated())
      .use(function meetsRequirements(req, res, next) {
        if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
          return next();
        } else {
          return res.status(403).send('Forbidden');
        }
      });
  },

  hasAnyRole: function(rolesRequired) {
    if (!rolesRequired || !rolesRequired.length) {
      throw new Error('Required role needs to be set');
    }
    return compose()
      .use(this.isAuthenticated())
      .use(function meetsRequirements(req, res, next) {
        if (rolesRequired.indexOf(req.user.role) !== -1) {
          return next();
        } else {
          return res.status(403).send('Forbidden');
        }
      });
  },

  /**
   * Returns a jwt token signed by the app secret
   */
  signToken: function (id, role) {
    return jwt.sign({ _id: id, role }, config.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
  },

  /**
   * Set token cookie directly for oAuth strategies
   */
  setTokenCookie: function (req, res) {
    if (!req.user) {
      return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
  }
};