var restify = require('restify'),
	server = restify.createServer(),
	sampleJSON = require('./sample');

// setup server
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.pre.sanitizePath());


function setCrossOriginHeaders(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	next();
}

function get(resonseData) {
	return function(req, res, next) {
		res.send(resonseData);
		return next();
	};
}

function put(req, res, next) {
	res.send(req.params);
	return next();
}

function del(req, res, next) {
	res.send(204);
	return next();
}

function log(req, res, next) {
	console.log(res.statusCode, req.route.method, req.url, req.params, req.headers);
	return next();
}

server.opts('.*', function (req, res, next) {

	if( req.headers.origin && req.headers['access-control-request-method']) {
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		res.setHeader('Access-Control-Allow-Credentials', 'true');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id, Authorization');
	    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
	    res.setHeader('Allow', req.headers['access-control-request-method']);
	    res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
		res.send(204);
		next();

	} else {
		res.send(404);
		next();
	}

});

// setup routes

server.get('/sample', setCrossOriginHeaders, get(sampleJSON), log);

// start server
server.listen(5001, function() {
	console.log('%s listening at %s', server.name, server.url);
});