var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PostalCodes = require('./lib/ken-all');

app.use(express.static('client'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());

app.get('/api/getaddress', function(req, res) {
   res.send(PostalCodes[req.query.postalcode]);
});

app.listen(8000);