var fs = require('fs');
var express = require('express');
var ect = require('ect');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.engine('ect', ect({
    watch: true,
    toor: __dirname + '/views',
    ect: '.ect'
}).render);
app.set('view engine', 'ect');

app.get('/', function(req, res) {
    var context = {
        data: JSON.stringify(readTodo())
    };

    console.log(context.data);
    res.render('index', context);
});


app.post('/tasks', function(req, res) {
    fs.writeFileSync('todo.json', JSON.stringify(req.body));
    res.status(200).end();
});

app.use(express.static('client'));
app.use(express.static('node_modules'));

app.listen(8000);

function readTodo() {
    try {
        return JSON.parse(fs.readFileSync('todo.json', 'utf8'));
    } catch (e) {
        return [];
    }
}