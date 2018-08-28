var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cookieSession = require('cookie-session');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('swag'));
app.use(express.static(path.join(__dirname, '../client/public')));

app.use(cookieSession({
  name: 'session',
  keys: ['bloop'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sessionRouter = require('./routes/session');
var volumesRouter = require('./routes/volumes');
var booksRouter = require('./routes/books');
var bookRequestsRouter = require('./routes/bookRequests');
var discussionsRouter = require('./routes/discussions');
var adminRouter = require('./routes/admin');

app.use('/', indexRouter);

app.use('/users', usersRouter);

app.use('/session', sessionRouter);
app.use('/volumes', volumesRouter);
app.use('/books', booksRouter);
app.use('/bookRequests', bookRequestsRouter);
app.use('/discussions', discussionsRouter);
app.use('/admin', adminRouter);

module.exports = app;

var server = http.createServer(app);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});

