/*global require: true, console: true, exports: true*/

var pep8 = require("../pep8").pep8;

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
