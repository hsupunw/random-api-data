var restify = require('restify');
var fs = require('fs');

// get endpoints info
var endpoints = fs.readFileSync('./endpoints/endpoints.txt', 'utf8')
// get all new lines data
var lines = endpoints.split('\n');


var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// create dynamic endpoints by line data
lines.map(e => {
	var api = e.split('#');
	if(!api[0]) return; // undefined info check
	var method = api[0].trim();
	var endpoint = api[1].trim();
	var response_json = JSON.parse(fs.readFileSync('./endpoints/' + api[2] + '.json'));
	//console.log(method.length, endpoint, response_json)	
	if(method === 'GET') {
		
		server.get(endpoint, function (req, res, next) {
  			res.send(response_json[getRandomInt(0, response_json.length-1)]);
  			return next();
 		});

	}

	if(method === 'POST') {
  
                  server.post(endpoint, function (req, res, next) {
                          res.send(response_json[getRandomInt(0, response_json.length-1)]);
                          return next();
                  });
  
          }

	
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});
