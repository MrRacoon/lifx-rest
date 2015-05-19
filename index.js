'use strict';
var restify   = require('restify');
var _         = require('lodash');
var lifx      = require('lifx');
var l         = lifx.init();

var translate = require('./translations');

var server    = restify.createServer({
    name: 'homeControl',
    version: '0.1.0'
});


// Parse POST data so that we can doo cool tricks
server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.queryParser());

// TODO: See what's up with this
server.use(restify.CORS());

var responses = {
    isOn    : 'Yup, It is in fact alive',
    lightsOn: 'Lights turning On',
    lightsOff: 'Lights turning off'
};

/**
 * verify that there is a server running
 */
server.get({
    name: 'isAlive',
    path: '/lighting',
    version: ['0.1.0']
}, function (req, res, next) {
    res.send(200, responses.isOn);
    return next();
});


server.get({
    name: 'getBulbs',
    path: '/lighting/bulbs',
    version: ['0.1.0']
}, function (req, res, next) {
    res.send(200, l.bulbs);
    return next();
});


server.get({
    name: 'LightsOn',
    path: /\/lighting\/on(\/(\w+)?)?/,
    version: '0.1.0'
}, function (req, res, next) {
    l.lightsOn(req.params[1]);
    res.send(200, responses.lightsOn);
    return next(false);
});


// TODO: Sticks
server.get({
    name: 'LightsOff',
    path: /\/lighting\/off(\/(\w+)?)?/,
    version: '0.1.0'
}, function (req, res, next) {
    l.lightsOff(req.params[1]);
    res.send(200, responses.lightsOff);
    return next(false);
});


function parsePayload(obj) {
    return _.transform(obj, function (ret, val, param) {
        switch (true) {
            case param === 'bulb':
                ret.bulb = val;
                break;
            case typeof val === 'number':
                ret[param] = Number(val & 0xffff);
                break;
            case typeof val === 'string':
                ret[param] = (translate[param] || {})[val];
                break;
            default:
                ret[param] = val;
                break;
        }
    });
}


server.post({
    name: 'LightChange',
    path: /\/lighting\/change(\/(\w+)?)?/,
    version: '0.1.0'
}, function (req, res, next) {

    var params  = typeof req.body === 'object' ? req.body : req.params;
    var payload = parsePayload(params);

    l.lightsColour(
        payload.hue   || translate.def.hue,
        payload.sat   || translate.def.sat,
        payload.lum   || translate.def.lum,
        payload.whi   || translate.def.whi,
        payload.fad   || translate.def.fad,
        payload.bulb  || translate.def.bulb // TODO: Doesn't seem to work...
    );

    res.send(200, 'changing bulbs');
    return next();
});


server.listen(3333, function () {
    console.log('%s listening at %s', server.name, server.url);
});
