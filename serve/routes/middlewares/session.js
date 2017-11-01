const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const {mongoose} = require('../../mongo');


const middleware = session({
  secret: 'ggwwss',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: false
});

module.exports = middleware;
