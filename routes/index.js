var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  req.models.person.find({ name: 'SB' }, function (err, result) {

  });
  res.render('index', { title: 'Express' });
});

router.get('/company/:id', function (req, res, next) {
  req.models.company.find({ id: req.params.id }, function (err, result) {
    if (err) {
      res.sendStatus(404);
      return;
    }

    res.send(result);
  });
});

router.post('/company', function (req, res, next) {
  if (!req.body.name) {
    res.sendStatus(404);
    return;
  }

  var company = {
    name: req.body.name,
    location: req.body.location,
    years_funded: req.body.years_funded,
    employer_count: req.body.employer_count,
    type: req.body.type,
    industry: req.body.industry
  }

  req.models.company.create(company, function (err, result) {
    if (err) {
      res.sendStatus(500);
    }

    res.send(result);
  });
});

module.exports = router;
