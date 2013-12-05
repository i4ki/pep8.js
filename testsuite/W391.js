/*global require: true, console: true, exports: true*/

var pep8 = require("../pep8").pep8;

exports.testTrailing_blank_lines = function (test) {
    "use strict";
    test.ok(pep8.trailing_blank_lines, "trailing_blank_lines exists");
    var lines = [
        "   def test(self):",
        "       pass",
        ""
    ];
    
    test.deepEqual({}, pep8.trailing_blank_lines(lines[0],
                                                 lines,
                                                 1));
    
    test.deepEqual({}, pep8.trailing_blank_lines(lines[1],
                                                 lines,
                                                 2));
    
    test.deepEqual({
        offset: 0,
        message: "W391 blank line at end of file"
    }, pep8.trailing_blank_lines(lines[2],
                                 lines,
                                 3));
    
    lines = [
        ""
    ];
    
    test.deepEqual({
        offset: 0,
        message: "W391 blank line at end of file"
    }, pep8.trailing_blank_lines(lines[0],
                                 lines,
                                 1));
    
    lines = [
        "",
        "",
        "",
        "pass()"
    ];
    
    test.deepEqual({}, pep8.trailing_blank_lines(lines[0],
                                 lines,
                                 1));
    test.deepEqual({}, pep8.trailing_blank_lines(lines[1],
                                 lines,
                                 2));
    
    test.deepEqual({}, pep8.trailing_blank_lines(lines[2],
                                 lines,
                                 3));
    
    test.deepEqual({}, pep8.trailing_blank_lines(lines[3],
                                                 lines,
                                                 4));
    
    lines = [
        "",
        "pass()"
    ];
    
    test.deepEqual({}, pep8.trailing_blank_lines(lines[0],
                                 lines,
                                 1));
    
    test.done();
};
