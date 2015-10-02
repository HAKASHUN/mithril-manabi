var fs = require('fs');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

app.use(bodyParser.json());

app.get('/tasks', function(req, res) {
   try {
       res.send(JSON.parse(fs.readFileSync('todo.json', 'utf8')));
   } catch(e) {
       res.send([]);
   }
});

app.post('/tasks', function(req, res) {
   fs.writeFileSync('todo.json', JSON.stringify(req.body));
    res.status(200).end();
});

app.use(express.static('client'));

app.listen(8000);