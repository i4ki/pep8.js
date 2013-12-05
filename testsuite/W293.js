/*global require: true, console: true, exports: true*/

var pep8 = require("../pep8").pep8;

exports.testTrailing_whitespace = function (test) {
    "use strict";
    
    test.ok(pep8.trailing_whitespace, "trailing whitespace exists");
    test.deepEqual({}, pep8.trailing_whitespace(""));
    
    test.deepEqual({}, pep8.trailing_whitespace("    def test():"));
    test.deepEqual({}, pep8.trailing_whitespace("\tdef test():"));
    test.deepEqual({}, pep8.trailing_whitespace("        def test():"));
    test.deepEqual({
        offset: 1,
        message: "W293 blank line contains whitespace"
    }, pep8.trailing_whitespace(" "));
    
    test.deepEqual({
        offset: 1,
        message: "W293 blank line contains whitespace"
    }, pep8.trailing_whitespace("  "));
    
    test.deepEqual({
        offset: 1,
        message: "W293 blank line contains whitespace"
    }, pep8.trailing_whitespace(" \t"));
    
    test.deepEqual({
        offset: 1,
        message: "W293 blank line contains whitespace"
    }, pep8.trailing_whitespace("\t"));
    
    test.deepEqual({
        offset: 1,
        message: "W293 blank line contains whitespace"
    }, pep8.trailing_whitespace("\t \v"));
    
    test.deepEqual({
        offset: 1,
        message: "W293 blank line contains whitespace"
    }, pep8.trailing_whitespace("  \t\t\t\v\v"));
    
    test.done();
};
