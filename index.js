var resitfy = require('restify');
var _       = require('lodash');
var lifx    = require('lifx');

var server = resitfy.createServer({
    name: 'home-control'
});

server.use(restify.bodyParser());

server.get({
    name: 'LightsOn',
    path: 'lighting/:bulbs/on',
    version: '0.1.0'
}, function (req, res, next) {
    req.lifx.lightsOn();
    next();
})



server.listen(3333, function () {
    console.log('%s listening at %s', server.name, server.url);
});
