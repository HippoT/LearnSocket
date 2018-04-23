var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'WebSocket Chat' });
  res.render('chat_view', { title: 'WebSocket Chat' });
});

module.exports = router;
