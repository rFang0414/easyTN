var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require("formidable");

/* GET home page. */
router.get('/', function (req, res, next) {
  req.models.person.find({ name: 'SB' }, function (err, result) {
  });
  res.render('index', {title: 'Express'});
});

router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = "./public/upload/temp/"; //改变临时目录
  form.parse(req, function (error, fields, files) {
    for (var key in files) {
      var file = files[key];
      var fName = (new Date()).getTime();
      switch (file.type) {
        case "image/jpeg":
          fName = fName + ".jpg";
          break;
        case "image/png":
          fName = fName + ".png";
          break;
        default:
          fName = fName + ".png";
          break;
      }
      console.log(file, file.size);
      var uploadDir = "./public/upload/" + fName;
      fs.rename(file.path, uploadDir, function (err) {
        if (err) {
          res.write(err + "n");
          res.end();
        }
//res.write("upload image:<br/>");
        res.write("<img src='/upload/" + fName + "' />");
        res.end();
      })
    }
  });
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
