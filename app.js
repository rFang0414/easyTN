var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();
var index = require('./routes/index');
var aboutUs = require('./routes/about-us');
var orm = require('orm');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(orm.express("mysql://root:" + process.env.DB_PASS + "@localhost/easyTN", {
    define: function (db, models, next) {
        models.person = db.define("person", {
            id: { type: 'serial', key: true }, // the auto-incrementing primary key
            name: { type: 'text' },
            surname: { type: 'text' },
            age: { type: 'number' }
        });

        models.person.sync(function (err) {

        });

        models.company = db.define("company", {
            id: { type: 'serial', key: true }, // the auto-incrementing primary key
            name: { type: 'text' },
            location: { type: 'text' },
            years_funded: { type: 'number' },
            employer_count: { type: 'number' },
            type: { type: 'text' },
            industry: { type: 'text' }

        });

        models.company.sync(function (err) {

        });
        next();
    }
}));

app.use('/', index);
app.use('/about', aboutUs);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
