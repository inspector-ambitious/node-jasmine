var fs = require('fs');
var filename = __dirname + '/jasmine-1.0.1/jasmine.js';

var data = fs.readFileSync(filename, 'utf8');
var jasmine = process.compile(data + '\njasmine;', filename);

jasmine.getAllSpecFiles = function(dir) {
    var files = fs.readdirSync(dir),
        specs = [],
        filename,
        subfiles;

    for (var i = 0, len = files.length; i < len; ++i) {
        filename = dir + '/' + files[i];
        if (fs.statSync(filename).isFile() && filename.match(/\.js$/)) {
            specs.push(filename);
        } else if (fs.statSync(filename).isDirectory()) {
            subfiles = this.getAllSpecFiles(filename);
            subfiles.forEach(function(result) {
                specs.push(result);
            });
        }
    }
    return specs;
};

jasmine.Reporter = {
    reportRunnerStarting: function(runner) {
        this.startedAt = new Date();
        this.outPut = "Started at " + this.startedAt;
    },
    reportRunnerResults: function(runner) {
        var results = runner.results();
        var specs = runner.specs();
        var specCount = 0;
        for (var i = 0; i < specs.length; i++) {
            specCount++;
        }
        var message = "" + specCount + " spec" + (specCount == 1 ? "" : "s") + ", " + results.failedCount + " failure" + ((results.failedCount == 1) ? "" : "s");
        message += " in " + ((new Date().getTime() - this.startedAt.getTime()) / 1000) + "s";
        this.outPut += message + "\nFinished at " + new Date();
        console.log(this.outPut);
        if (this.endWith) {
            this.endWith();
        }
    },
    reportSpecResults: function(spec) {
        var results = spec.results();

        var resultItems = results.getItems();
        var outPut = "";
        resultItems.forEach(function(result) {
            if (result.type == 'log') {
                outPut += result.toString();
            } else if (result.type == 'expect' && result.passed && !result.passed()) {
                if (result.trace.stack) {
                    outPut += spec.getFullName() + '\n\033[31m' + result.trace.stack + '\033[0m\n';
                }
            }
        });
        this.outPut += outPut;
    }
};

