// Map of various hues by name
var hueMap = {
    red           : 0x0000
    , orange      : 0x1800
    , gold        : 0x2000
    , yellow      : 0x2400
    , yellowGreen : 0x3000
    , green       : 0x5000
    , cyan        : 0x8000
    , skyBlue     : 0x9000
    , blue        : 0x9400
    , lightBlack  : 0xa000
    , black       : 0xb000
    , purple      : 0xc000
    , pink        : 0xd000
    , darkPink    : 0xe000
    , hotPink     : 0xe000
    , salmon      : 0xf000
};

// Map of various saturations by name
var satMap = {
    white   : '0x0000'
    , color : '0xffff'
};

// Map of various luminesences by name
var lumMap = {
    off      : '0x0000'
    , low    : '0x4000'
    , medium : '0x8000'
    , high   : '0xc000'
    , on     : '0xffff'
};

// Map of various whites by name
var whiMap = {
    off     : '0x0000'
    , low    : '0x4000'
    , medium : '0x8000'
    , high   : '0xc000'
    , on     : '0xffff'
};

// Map of various fades by name
var fadMap = {
    now     : '0x0000'
    , quick : '0x0100'
    , fast  : '0x0200'
    , soon  : '0x0400'
    , walk  : '0x0800'
    , mosey : '0x1000'
    , slow  : '0x1000'
    , creep : '0x2000'
};

var defMap = {
    hue:   0x0000
    , sat: 0x0000
    , lum: 0x0000
    , whi: 0x0000
    , fad: 0x0000
}

module.exports = {
    hue            : hueMap

    , saturation   : satMap
    , sat          : satMap

    , luminescence : lumMap
    , lum          : lumMap

    , whites       : whiMap
    , whi          : whiMap

    , fade         : fadMap
    , fad          : fadMap

    , defaults     : defMap
    , def          : defMap
};
