var restify = require('restify');
var _       = require('lodash');
var lifx    = require('lifx');
var l       = lifx.init();
var t       = require('./lighting');

var server = restify.createServer({
    name: 'homeControl',
    version: '0.1.0'
});

// Parse POST data so that we can doo cool tricks
server.use(restify.bodyParser());
// server.use(restify.queryParser());

// TODO: See what's up with this
server.use(restify.CORS());


responses = {
    lightsOn: 'Lights turning On'
};

/**
 * verify that there is a server running
 */
server.get({
    name: 'isAlive',
    path: '/lighting',
    version: ['0.1.0']
}, function (req, res, next) {
    res.send(200, 'yup its on');
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
    name: 'LightsOffAll',
    path: '/lighting/off',
    version: ['0.1.0'],
}, function (req, res, next) {
    l.lightsOff();
    res.send(200);
    return next();
});

server.get({
    name: 'LightsOnAll',
    path: '/lighting/on',
    version: ['0.1.0'],
}, function (req, res, next) {
    l.lightsOn();
    res.send(200, responses.lightsOn);
    return next();
});

server.get({
    name: 'LightsOn',
    path: '/lighting/:bulbs/on',
    version: '0.1.0'
}, function (req, res, next) {
    if (req.params.bulbs === 'all') {
        l.lightsOn();
        res.send(200, responses.lightsOn);
    }
    else {
        l.lightsOn(req.params.bulbs);
        res.send(200, responses.lightsOn);
    }
    return next();
});


server.get({
    name: 'LightsOff',
    path: '/lighting/:bulbs/off',
    version: '0.1.0'
}, function (req, res, next) {
    if (req.params.bulbs === 'all') {
        l.lightsOff();
        res.send(200, responses.lightsOff);
    } else {
        l.lightsOff(req.params.bulbs);
        res.send(200, responses.lightsOff);
    }
    return next();
});

function changeBulbs (params) {
    l.lightsColour(
        !_.isUndefined(params.hue) ? params.hue : t.def.hue,
        !_.isUndefined(params.sat) ? params.sat : t.def.sat,
        !_.isUndefined(params.lum) ? params.lum : t.def.lum,
        !_.isUndefined(params.whi) ? params.whi : t.def.whi,
        !_.isUndefined(params.fad) ? params.fad : t.def.fad
    );
}


server.post({
    name: 'LightChange',
    path: '/lighting/change',
    version: '0.1.0'
}, function (req, res, next) {

    function convert(obj) {
        return _.transform(obj, function (ret, val, key) {

            if (_.isUndefined(val)) {
                return;
            }
            // Match the value to hex if you can, and then cast it to a number
            var num = (val.match(/^(0x)[0-9A-Fa-f]*$/) || [''] )[0]

            if (num) {
                val = Number(num);
            }

            switch (typeof val) {
                case 'number':
                    console.log('got number: ' + val);
                    // Make sure the number is not out of bounds
                    ret[key] = val & 0xffff;
                    break;
                case 'string':
                    console.log('got string: ' + val);
                    // Lookup the keyword in the lookup table, else default
                    ret[key] = t[key][val];
                    break;
                default:
                    console.log('got nuthin\': ' + val);
                    // anything else just gets left alone for now
                    ret[key] = val;
                break;
            }
        })
    }

    req.params = convert(req.params);

    changeBulbs(req.params);

    res.send(200, 'changing bulbs');
    return next();
});


server.listen(3333, function () {
    console.log('%s listening at %s', server.name, server.url);
});
