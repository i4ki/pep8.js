/*global require: true, console: true, exports: true*/

var pep8 = require("../pep8").pep8;

exports.testMissing_newline = function (test) {
    "use strict";
    test.ok(pep8.missing_newline, "missing_newlines exists");
    test.deepEqual({}, pep8.missing_newline("\n"));
    test.deepEqual({}, pep8.missing_newline(" \n"));
    test.deepEqual({}, pep8.missing_newline("  \n"));
    test.deepEqual({}, pep8.missing_newline("\t\n"));
    test.deepEqual({
        offset: 0,
        message: "W292 no newline at end of file"
    }, pep8.missing_newline(""));
    
    test.deepEqual({
        offset: 1,
        message: "W292 no newline at end of file"
    }, pep8.missing_newline(" "));
    
    test.deepEqual({
        offset: 19,
        message: "W292 no newline at end of file"
    }, pep8.missing_newline("    def test(self):"));
    
    test.deepEqual({
        offset: 4,
        message: "W292 no newline at end of file"
    }, pep8.missing_newline("pass"));
    
    test.done();
};
