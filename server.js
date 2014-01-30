var restify = require('restify'),
	authenticationContext = require('./authentication'),
	broadcastJSON = require('./broadcast'),
	scheduleJSON = require('./schedule'),
	channelsJSON = require('./channels'),
	channelJSON = require('./channel'),
	enrichmentJSON = require('./enrichment');


var isAuthenticated = false;

function setHeaders(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', 'http://admin.local.like.tv:9000');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	next();
}

function me(req, res, next) {

	if(!isAuthenticated) {
		res.status(403);
		res.send({
			message: 'Access is denied. You need to reauthenticate'
		});
		return next();
	}

	res.send(authenticationContext)
	return next();
}

function login(req, res, next) {

	isAuthenticated = true;

	var callbackUrl = req.params.callbackUrl || req.headers['referer'];

	console.log(callbackUrl);

	if(!callbackUrl) {
		res.send(authenticationContext);
		return next();
	}

	res.header('Location', callbackUrl);
	res.send(302);
	return next(false);
}

function logout(req,res, next) {

	isAuthenticated = false;

	res.send({message: 'Your logged out.'});
	return next();
}

function schedule(req, res, next) {
	res.send(scheduleJSON);
	return next();
}

function get_broadcast(req, res, next) {
	broadcastJSON.id = req.params.broadcastId;
	res.send(broadcastJSON);
	return next();
}

function get_enrichment(req, res, next) {
	res.send(enrichmentJSON);
	return next();
}

function get_channel(req, res, next) {
	channelJSON.id = req.params.channelId;
	res.send(channelJSON);
	return next();
}

function get_channels(req, res, next) {
	res.send(channelsJSON);
	return next();
}

function get(req, res, next) {
	res.send({ message: "OK"});
	return next();
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
	console.log("User is:", isAuthenticated);
	return next();
}

// setup server

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.pre.sanitizePath());

// setup routes

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

server.get('/authentication/me', setHeaders, me, log);
server.get('/authentication/login', setHeaders, login, log);
server.get('/authentication/logout', setHeaders, logout, log);
server.get('/schedule/se', setHeaders, schedule, log);
server.get('/channel/se/:channelId', setHeaders, get_channel, log);

server.get('/jobs/:identifier/start', setHeaders, get, log);

server.get('/broadcast/:broadcastId', setHeaders, get_broadcast, log);
server.post('/broadcast/:broadcastId', setHeaders, put, log);
server.post('/broadcast/:broadcastId/mediatype', setHeaders, put, log);

server.get('/broadcast/:broadcastId/enrichment/:enrichmentId', setHeaders, get_enrichment, log);

server.del('/enrichment/:enrichmentId', setHeaders, del, log);
server.post('/enrichment/:enrichmentId', setHeaders, put, log);

server.del('/enrichment/:enrichmentId/googlenewskeywords', setHeaders, del, log);
server.post('/enrichment/:enrichmentId/googlenewskeywords', setHeaders, put, log);

server.del('/enrichment/:enrichmentId/facebookgroups', setHeaders, del, log);
server.post('/enrichment/:enrichmentId/facebookgroups', setHeaders, put, log);

server.del('/enrichment/:enrichmentId/links', setHeaders, del, log);
server.post('/enrichment/:enrichmentId/links', setHeaders, put, log);

server.del('/enrichment/:enrichmentId/roles', setHeaders, del, log);
server.post('/enrichment/:enrichmentId/roles', setHeaders, put, log);

server.del('/enrichment/:enrichmentId/images', setHeaders, del, log);
server.post('/enrichment/:enrichmentId/images', setHeaders, put, log);

server.post('/imagepersistor', setHeaders, put, log);

server.get('/channels', setHeaders, get_channels, log);

server.post('/post', setHeaders, put, log);



// start server

server.listen(5001, function() {
	console.log('%s listening at %s', server.name, server.url);
})