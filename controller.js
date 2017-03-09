var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var data = [];

module.exports = function(app){
    
    app.get('/todo/items', function(req, res){
        
        res.json(data);
    });
    
    
    app.get('/todo', function(req, res){
        /*data = data.filter(function(obj){
            return obj.item !== undefined;
        });*/
        res.render('index', {todo : data});
    });

    app.post('/todo', urlencodedParser, function(req, res){    
        data.push(req.body);
        res.json(data);
    });

    app.delete('/todo', urlencodedParser, function(req, res){ 

        var delIndex = Number(req.body.index);

        data.splice(delIndex, 1);

        res.json(data);
    });
}