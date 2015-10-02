var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(express.static('client'));
app.use(express.static('node_modules'));
app.use(/\/[A-Z][a-z]+([A-Z][a-z]+)+/, express.static('client/index.html'));
app.use(bodyParser.json());

app.get('/api/:pagename', function(req, res) {
   var source = '';
    var pageTitles = [];

    try {
        var sources = JSON.parse(fs.readFileSync('wiki.json', 'utf8'));
        if (sources.hasOwnProperty(req.params.pagename)) {
            source = sources[req.params.pagename];
        }
        for (var key in sources) {
            if(sources.hasOwnProperty(key)) {
                pageTitles.push(key);
            }
        }
    } catch(e) {
        // pass
    }
    res.send({
        source: source,
        pageTitles: pageTitles
    })
});

app.post('/api/:pagename', function(req, res) {
    var source;
    try {
        source = JSON.parse(fs.readFileSync('wiki.json', 'utf8'));
    } catch(e) {
        source = {};
    }

    source[req.params.pagename] = req.body.source;
    fs.writeFileSync('wiki.json', JSON.stringify(source));
    res.status(200).end();
});

console.log('start listening at 8000');
app.listen(8000);