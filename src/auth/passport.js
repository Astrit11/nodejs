const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
// const User = require("../models/rest/User");
// import User from '../models/rest/User'
const db = require('../models');
const User = db.rest.models.user;

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      return User.findOne({ where: { username: jwtPayload.username } })
        .then((user) => {
          return done(null, user);
        }).catch((err) => {
          return done(err);
        });
    }
  )
);

