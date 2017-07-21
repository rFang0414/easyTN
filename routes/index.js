var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require("formidable");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Welcome to your website'});
});

router.get('/edit', function (req, res, next) {
  res.render('admin/create-edit-page', {title: 'Build your webiste'});
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

        // save to db
        var logo = {company_id:'1', path: "/upload/" + fName};
        req.models.companyLogos.create(logo, function (err, results) {
          console.log('--------------------------INSERT----------------------------');
          //console.log('INSERT ID:',result.insertId);
          console.log('INSERT ID:', results);
          console.log('-----------------------------------------------------------------/n/n');
        });

        res.send("/upload/" + fName);
      })
    }
  });
});

router.get('/company/:id', function (req, res, next) {
  req.models.company.find({id: req.params.id}, function (err, result) {
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

router.get('/company-content/:company_id', function (req, res, next) {
  req.models.companyContent.find({ company_id: req.params.company_id }, function (err, result) {
    if (err) {
      res.sendStatus(404);
      return;
    }

    res.send(result);
  });
});

router.post('/company-content', function (req, res, next) {
  if (!req.body.company_id) {
    res.sendStatus(404);
    return;
  }

  var companyContent = {
    company_id: req.body.company_id,
    mission: req.body.mission,
    about_us: req.body.about_us,
    contact_us: req.body.contact_us,
    logo: req.body.logo,
    hp_imgs: req.body.hp_imgs,
    about_us_imgs: req.body.about_us_imgs
  };

  req.models.companyContent.create(companyContent, function (err, result) {
    if (err) {
      res.sendStatus(500);
    }

    res.send(result);
  });
});

module.exports = router;
