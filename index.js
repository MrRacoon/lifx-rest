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
    isOn       : 'Yup, It is in fact alive',
    lightsOn   : 'Lights turning On',
    lightsOff  : 'Lights turning off',
    bulbSet    : 'Setting Bulb',
    bulbChange : 'Changing Bulb',
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

    res.send(200, responses.bulbSet);
    return next();
});

server.get({
    name: 'modifyASetting',
    path: /\/lighting\/mod\/(\w+)(\/(\w+)?(\/(\w+)?)?)?/,
    version: '0.2.0'
}, function (req, res, next) {
    var setting = req.params[0];
    var amount  = req.params[2];
    var bulb    = req.params[4];

    console.log(req.params);

    var params = {};
    params[setting] = (translate[setting] || {})[amount];

    console.log(params);
    changeBulb(params, bulb);

    res.send(200);
    next();
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


function changeBulb (newState, bulb) {
    if (_.isUndefined(bulb)) {                      // No bulb was specified
        return _.map(                                      // 
            _.keys(l.bulbs),                        // collection: BulbNames
            _.partial(changeBulb, newState)         // function  : Partially applied newState to changeBulb
        );
    }
    else if (l.bulbs[bulb]) {                       // If we have a state on file
        var initState = l.bulbs[bulb].state;        // Grab that state
        l.lightsColour(
            newState.hue || initState.hue,          // 
            newState.sat || initState.saturation,   //
            newState.lum || initState.brightness,   // 
            newState.whi || initState.kelvin,       //
            newState.fad || translate.def.fad,      //
            bulb
        );
        return bulb;
    }
}


server.get({
    name: 'test',
    path: '/test',
    version: '0.2.0'
}, function (req, res, next) {


        console.log(l.bulbs);
        console.log(l.requestStatus());
        console.log(l.bulbs);

        // l.lightsColour(0x1111, 0x2222, 0x3333, 0x4444, 0x5555, 'd073d502a2ea');
        l.lightsOn('d073d502a2ea');

    res.send(200);
    next();
});

server.listen(3333, function () {
    console.log('%s listening at %s', server.name, server.url);
});
