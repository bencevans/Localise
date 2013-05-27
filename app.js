
var express = require('express'),
    app = express(),
    hbs = require('hbs'),
    async = require('async'),
    _ = require('underscore'),
    http = require('http'),
    path = require('path'),
    RedisStore = require('connect-redis')(express);

hbs.registerHelper('domain', require('./views/helpers/domain'));
hbs.registerHelper('time_ago', require('./views/helpers/time_ago'));

var routes = {
  news: require('./routes/news'),
  auth: require('./routes/auth'),
  user: require('./routes/user')
};


app.configure(function() {
  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('secretz'));
  app.use(express.session({store: new RedisStore()}));
  app.use(routes.auth.addUserToRequest);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

/**
 * News Routes
 */

app.get('/', routes.news.index);
app.get('/new', routes.news['new']);
app.get('/best', routes.news.best);
app.get('/item/:item', routes.news.item);
app.get('/item/:item/vote', routes.auth.isLoggedIn, routes.news.vote);

app.get('/user/:user', routes.user.profile);

app.get('/submit', routes.auth.isLoggedIn, routes.news.submit);
app.post('/submit', routes.auth.isLoggedIn, routes.news.submitAction);

/**
 * Auth Routes
 */

app.get('/auth', routes.auth.index);
app.post('/auth/login', routes.auth.login);
app.post('/auth/register', routes.auth.register);
app.get('/logout', routes.auth.logout);

var server = http.createServer(app).listen(process.env.PORT || 3000);

