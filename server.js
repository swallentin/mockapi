var restify = require('restify'),
	authenticationContext = require('./authentication'),
	broadcastJSON = require('./broadcast'),
	scheduleJSON = require('./schedule'),
	channelJSON = require('./channel');


var isAuthenticated = false;

function setHeaders(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
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

function get_channel(req, res, next) {
	channelJSON.id = req.params.channelId;
	res.send(channelJSON);
	return next();
}

function put(req, res, next) {
	res.send(req.params);
	return next();
}


function log(req, res, next) {
	console.log(res.statusCode, req.route.method, req.url, req.params);
	console.log("User is:", isAuthenticated);
	return next();
}

// setup server

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());


// setup routes

server.get('/authentication/me', setHeaders, me, log);
server.get('/authentication/login', setHeaders, login, log);
server.get('/authentication/logout', setHeaders, logout, log);
server.get('/schedule/se', setHeaders, schedule, log);

server.get('/broadcast/se/:broadcastId', setHeaders, get_broadcast, log);
server.put('/broadcast/se/:broadcastId', setHeaders, put, log);
server.put('/broadcast/se/:broadcastId/enrichment/:enrichmentId', setHeaders, put, log);
server.put('/broadcast/se/:broadcastId/enrichment/:enrichmentId/googleNewsKeywords', setHeaders, put, log);
server.put('/broadcast/se/:broadcastId/enrichment/:enrichmentId/facebookGroups', setHeaders, put, log);
server.put('/broadcast/se/:broadcastId/enrichment/:enrichmentId/images', setHeaders, put, log);
server.put('/broadcast/se/:broadcastId/enrichment/:enrichmentId/links', setHeaders, put, log);
server.put('/broadcast/se/:broadcastId/enrichment/:enrichmentId/roles', setHeaders, put, log);

server.get('/channel/se/:channelId', setHeaders, get_channel, log);



// start server

server.listen(5001, function() {
	console.log('%s listening at %s', server.name, server.url);
})