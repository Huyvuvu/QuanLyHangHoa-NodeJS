var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// var insertRouter = require('./routes/insert.js');
// var updateRouter = require('./routes/update.js');
// var deleteRouter = require('./routes/delete.js');
// var loginRouter = require('./routes/login.js');
// var registerRouter = require('./routes/register.js');

var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//thêm này vào để lúc login mới hiện xóa sửa
var expressSession = require('express-session');
app.use(expressSession({secret: 'secret'}));

app.use(require('connect-flash')());
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req, res);
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// app.use('dangky', registerRouter);
// app.use('dangnhap', loginRouter);
// app.use('/them', insertRouter);
// app.use('/xoa', deleteRouter);
// app.use('/sửa', updateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
