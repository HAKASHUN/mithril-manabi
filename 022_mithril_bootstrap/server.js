var express = require('express');
var app = express();

app.use(express.static('client'));
app.use(express.static('bower_components'));
app.use(express.static('node_modules'));

app.listen(8000);

