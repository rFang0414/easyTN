var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.models.person.find({name:'SB'}, function (err, result) {
    console.log(result[0].name)
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
