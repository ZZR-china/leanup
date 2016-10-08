'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
var ejs = require('ejs');

var config = require('./config');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

//import routes
// var todosRoute = require('./routes/todos');
var blogRoute = require('./routes/blog');
// var wechat = require('/routes/weichat.js');


//import controllers
var wechatBot = require('./server/controllers/wechatBot');

var app = express();

// 设置模板引擎
app.set('views', path.join(config.rootname + '/client/views/'));

app.set('view engine', 'ejs');


app.use(express.static('./client/statics/'));

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.express());


//some middlewares
// app.use(favicon(__dirname + '/client/statics/favicon.ico'));
app.use(flash());
app.use(logger('dev'));//日志中间件
app.use(logger({stream: accessLog}));//将日志保存为日志文件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(session({
  secret: config.cookieSecret,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  url: config.url
}));


// app.get('/', function(req, res) {
//   res.render('index', { currentTime: new Date() });
// });

//use route
// app.use('/todos', todosRoute);
app.use('/', blogRoute);

//controller use
app.use(express.query());
app.use('/wechatbot', wechatBot);

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  var statusCode = err.status || 500;
  if(statusCode === 500) {
    console.error(err.stack || err);
  }
  if(req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
  next();
});

module.exports = app;
