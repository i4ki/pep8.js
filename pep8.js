/**
 * pep8.js
 * Author: Tiago Natel de Moura
 *
 * Port of https://github.com/jcrocholl/pep8
 */

/*global require: true, console: true, exports: true*/

var fs = require("fs");

var pep8 = (function () {
    "use strict";
    var INDENT_REGEX = /([ \t]*)/,
        INDENT_CHAR = ' ',
        
        /* private methods */
        noqa,
        tabs_or_spaces,
        tabs_obsolete,
        trailing_whitespace,
        trailing_blank_lines,
        missing_newline,
        maximum_line_length,
        setFile,
        verifyData,
        verifyFile;
    
    /**
     * PyFlakes line annotation to ignore PEP8
     * Use # NOQA or # noqa
     */
    noqa = function (line) {
        return line.indexOf("# noqa") !== -1 ||
            line.indexOf("# NOQA") !== -1;
    };
    
    /**
     * Never mix tabs and spaces.
     *
     * The most popular way of indenting Python is with spaces only.  The
     * second-most popular way is with tabs only.  Code indented with a
     * mixture of tabs and spaces should be converted to using spaces 
     * exclusively.  When invoking the Python command line interpreter with
     * the -t option, it issues warnings about code that illegally mixes
     * tabs and spaces.  When using -tt these warnings become errors.
     * These options are highly recommended!
     *
     * Okay: if a == 0:\n        a = 1\n        b = 1
     * E101: if a == 0:\n        a = 1\n\tb = 1
     */
    tabs_or_spaces = function (physical_line, indent_char) {
        var idx_space,
            idx_tab,
            result = physical_line.match(INDENT_REGEX);
        
        if (result.length > 0) {
            result = result[0];
            
            idx_space = result.indexOf(indent_char);
            idx_tab = result.indexOf("\t");
            
            if (idx_space !== -1 &&
                    idx_tab !== -1) {
                return {
                    offset: idx_tab + 1,
                    message: "E101 indentation contains mixed spaces and tabs"
                };
            }
        }
        
        return {};
    };
    
    /**
     * For new projects, spaces-only are strongly recommended over tabs.  Most
     * editors have features that make this easy to do.
     *
     * Okay: if True:\n    return
     * W191: if True:\n\treturn
     */
    tabs_obsolete = function (physical_line) {
        var	result = physical_line.match(INDENT_REGEX),
            i,
            idx;
        
        if (result.length > 0) {
            result = result[0];
            
            idx = result.indexOf("\t");
            if (idx !== -1) {
                return {
                    offset: idx + 1,
                    message: "W191 indentation contains tabs"
                };
            }
        }
        
        return {};
    };
    
    /**
     * JCR: Trailing whitespace is superfluous.
     * FBM: Except when it occurs as part of a blank line (i.e. the line is
     *      nothing but whitespace). According to Python docs[1] a line with
     * only whitespace is considered a blank line, and is to be ignored.
     * However, matching a blank line to its indentation level avoids
     * mistakenly terminating a multi-line statement (e.g. class declaration)
     * when pasting code into the standard Python interpreter.
     *
     * [1] http://docs.python.org/reference/lexical_analysis.html#blank-lines
     *
     * The warning returned varies on whether the line itself is blank, for
     * easier filtering for those who want to indent their blank lines.
     *
     * Okay: spam(1)\n#
     * W291: spam(1) \n#
     * W293: class Foo(object):\n    \n    bang = 12
     */
    trailing_whitespace = function (physical_line) {
        var stripped;
        
        physical_line = physical_line.replace(/[\n\r]*$/g, "");
        physical_line = physical_line.replace(/[\x0c]*$/g, "");
        stripped = physical_line.replace(/[ \t\v]*$/g, "");
        
        if (physical_line !== stripped) {
            if (stripped) {
                return {
                    offset: stripped.length,
                    message: "W291 trailing whitespace"
                };
            } else {
                return {
                    offset: 1,
                    message: "W293 blank line contains whitespace"
                };
            }
        }
        
        return {};
    };
    
    /**
     * JCR: Trailing blank lines are superfluous.
     *
     *    Okay: spam(1)
     *    W391: spam(1)\n
     */
    trailing_blank_lines = function (physical_line, lines, line_number) {
        if (!physical_line.replace(/^[\n\r]$/g) &&
                line_number === lines.length) {
            return {
                offset: 0,
                message: "W391 blank line at end of file"
            };
        }
        
        return {};
    };
    
    /**
     * JCR: The last line should have a newline.
     *
     * Reports warning W292.
     */
    missing_newline = function (physical_line) {
        if (physical_line.replace(/[\r\n]*$/g, "") === physical_line) {
            return {
                offset: physical_line.length,
                message: "W292 no newline at end of file"
            };
        }
        
        return {};
    };
    
    /**
     * Limit all lines to a maximum of 79 characters.
     *
     * There are still many devices around that are limited to 80 character
     * lines; plus, limiting windows to 80 characters makes it possible to
     * have several windows side-by-side.  The default wrapping on such 
     * devices looks ugly.
     * Therefore, please limit all lines to a maximum of 79 characters.
     * For flowing long blocks of text (docstrings or comments), limiting the
     * length to 72 characters is recommended.
     *
     * Reports error E501.
     */
    maximum_line_length = function (physical_line, max_line_length) {
        var line    = physical_line.replace(/[\r\n]*$/g, ""),
            length  = line.length;
        
        if (length > max_line_length && !noqa(line)) {
            return {
                offset: max_line_length,
                message: "E501 line too long (" +
                    length + " > " + max_line_length + " characters)"
            };
        }
        
        return {};
    };
    
    setFile = function (path) {
        this.filename = path;
    };
    
    verifyData = function (data, options) {
        var lines,
            i,
            ret;
            
        lines = data.split("\n");
            
        for (i = 0; i < lines.length; i += 1) {
            ret = tabs_or_spaces(lines[i], " ");
            console.log(ret);
            
            ret = tabs_obsolete(lines[i]);
            console.log(ret);
                
            ret = trailing_whitespace(lines[i]);
            console.log(ret);
        }
    };
    
    verifyFile = function (file, options) {
        fs.readFile(file, "utf8", function (err, data) {
            if (err) {
                console.log("[ERROR] Failed to open '" + file + "'");
                console.log("[ERROR] Error code = " + err.code);
                return;
            }
            
            return verifyData(data, options);
        });
    };
    
    /* public API */
    return {
        noqa: noqa,
        tabs_or_spaces: tabs_or_spaces,
        tabs_obsolete: tabs_obsolete,
        trailing_blank_lines: trailing_blank_lines,
        trailing_whitespace: trailing_whitespace,
        missing_newline: missing_newline,
        maximum_line_length: maximum_line_length,
        setFile: setFile,
        verifyFile: verifyFile
    };
}());

//pep8.verifyFile("./test2.py");

exports.pep8 = pep8;