/*global require: true, console: true, exports: true*/

var pep8 = require("../pep8").pep8;

exports.testTab_or_space = function (test) {
    "use strict";
    test.ok(pep8.tabs_or_spaces, "tabs_or_spacess exists");
    test.deepEqual({}, pep8.tabs_or_spaces("", " "),
                  "empty string");
    
    test.deepEqual({}, pep8.tabs_or_spaces(
        "    def test(self):",
        " "
    ), "using only 4 spaces");
    
    test.deepEqual({}, pep8.tabs_or_spaces(
        "TESTE = 1",
        " "
    ), "no indent");
    
    test.deepEqual({}, pep8.tabs_or_spaces(
        "  LALA = 1",
        " "
    ), "two spaces");
    
    test.deepEqual({}, pep8.tabs_or_spaces(
        "	def test(self):",
        " "
    ), "one tab");
    
    test.deepEqual({}, pep8.tabs_or_spaces(
        "		def test(self):",
        " "
    ), "two tabs");
    
    test.deepEqual({
		offset: 5,
		message: "E101 indentation contains mixed spaces and tabs"
	}, pep8.tabs_or_spaces(
        "    \tdef test(self):",
        " "
    ), "mixing tab and space");
	
	test.deepEqual({
		offset: 1,
		message: "E101 indentation contains mixed spaces and tabs"
	}, pep8.tabs_or_spaces(
        "	 def test(self):",
        " "
    ), "mixing tab and space");
    
    test.done();
};
