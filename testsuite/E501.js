/*global require: true, console: true, exports: true*/

var pep8 = require("../pep8").pep8;


exports.testMaximum_line_length = function (test) {
    "use strict";
    test.ok(pep8.maximum_line_length);
    test.deepEqual({}, pep8.maximum_line_length("", 0));
    test.deepEqual({}, pep8.maximum_line_length("", 1));
    test.deepEqual({}, pep8.maximum_line_length("", 2));
    
    test.deepEqual({
        offset: 0,
        message: "E501 line too long (1 > 0 characters)"
    }, pep8.maximum_line_length(" ", 0));
    
    test.deepEqual({}, pep8.maximum_line_length("a", 1));
    test.deepEqual({}, pep8.maximum_line_length("a", 2));
    test.deepEqual({}, pep8.maximum_line_length("a", 3));
    test.deepEqual({}, pep8.maximum_line_length("a", 4));
    test.deepEqual({}, pep8.maximum_line_length("a", 5));
    
    test.deepEqual({
        offset: 9,
        message: "E501 line too long (10 > 9 characters)"
    }, pep8.maximum_line_length(
        "AAAAAAAAAA",
        9
    ));
    
    test.done();
};
