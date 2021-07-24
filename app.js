var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
/********************************************
 * ROUTERS
 *******************************************/
const cryptRouter = require('./routes/cryptRouter');
/********************************************
 * EXPRESS / SERVER SETUP
 *******************************************/
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(logger('dev'));
app.use(express.json());
const corsOptions = {
//    origin: 'http://localhost',
    optionsSuccessStatus: 200,
    methods: "POST"
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/********************************************
 * MIDDLEWARE
 *******************************************/


/********************************************
 * ROUTES
 *******************************************/
app.use('/', cryptRouter);
/********************************************
 * ERROR HANDLING
 *******************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;