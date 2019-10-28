var express = require('express');
var router = express.Router();
var fs = require('fs');

var mysql = require("mysql");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/input',function (req, res, next) {
    res.render('input', { title: '新建专题' });
});
module.exports = router;
