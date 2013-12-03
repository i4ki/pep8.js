/*global require: true, console: true, exports: true*/

var pep8 = require("./pep8");

exports.testTab_or_space = function (test) {
    "use strict";
    test.ok(pep8.tabs_or_space, "tabs_or_spaces exists");
    test.deepEqual({}, pep8.tabs_or_space("", " "),
                  "empty string");
    
    test.deepEqual({}, pep8.tabs_or_space(
        "    def test(self):",
        " "
    ), "using only 4 spaces");
    
    test.deepEqual({}, pep8.tabs_or_space(
        "TESTE = 1",
        " "
    ), "no indent");
    
    test.deepEqual({}, pep8.tabs_or_space(
        "  LALA = 1",
        " "
    ), "two spaces");
    
    test.deepEqual({}, pep8.tabs_or_space(
        "	def test(self):",
        " "
    ), "one tab");
    
    test.deepEqual({}, pep8.tabs_or_space(
        "		def test(self):",
        " "
    ), "two tabs");
    
    test.deepEqual({
		offset: 5,
		message: "E101 indentation contains mixed spaces and tabs"
	}, pep8.tabs_or_space(
        "    \tdef test(self):",
        " "
    ), "mixing tab and space");
	
	test.deepEqual({
		offset: 1,
		message: "E101 indentation contains mixed spaces and tabs"
	}, pep8.tabs_or_space(
        "	 def test(self):",
        " "
    ), "mixing tab and space");
    
    test.done();
};

exports.testTab_obsolete = function (test) {
	"use strict";
	
	test.ok(pep8.tabs_obsolete, "tabs_obsolete exists");
	test.deepEqual({}, pep8.tabs_obsolete(""));
    test.deepEqual({}, pep8.tabs_obsolete("    "));
    test.deepEqual({}, pep8.tabs_obsolete("   "));
    test.deepEqual({}, pep8.tabs_obsolete("  "));
    test.deepEqual({}, pep8.tabs_obsolete(" "));
    test.deepEqual({}, pep8.tabs_obsolete(""));
    
    test.deepEqual({
		offset: 1,
		message: "W191 indentation contains tabs"
	}, pep8.tabs_obsolete("\t"));
	test.deepEqual({
        offset: 1,
        message: "W191 indentation contains tabs"
    }, pep8.tabs_obsolete("\t\t"));
    
    test.deepEqual({
        offset: 7,
        message: "W191 indentation contains tabs"
    }, pep8.tabs_obsolete("      \t"));
	
	test.done();
};

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