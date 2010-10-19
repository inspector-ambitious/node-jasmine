process.on('uncaughtException', function(err) {
    console.log('Caught exception: ', err, this);
});

require("./lib/jsdom-hooks");
require("./lib/jasmine-hooks");

require("./includes");

var specs = jasmine.getAllSpecFiles(__dirname + '/' + process.argv[2]);

for (var i = 0, len = specs.length; i < len; ++i) {
    require(specs[i].replace(/\.js$/, ""));
}

process.stdout.on('close', function() {
    process.exit();
});

var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 1000;

jasmine.Reporter.endWith = function() {
    process.stdout.flush();
    process.stdout.end();
};
jasmineEnv.addReporter(jasmine.Reporter);
jasmineEnv.execute();

