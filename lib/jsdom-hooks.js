var jsdom = require('jsdom').jsdom;
var w = jsdom('<html><head></head><body></body></html>').createWindow();

for (var key in w) {
    global[key] = w[key];
}

global.window = global;
