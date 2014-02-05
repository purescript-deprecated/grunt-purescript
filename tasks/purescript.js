/*
 * grunt-purescript
 * https://github.com/garyb/grunt-purescript
 *
 * Copyright (c) 2014 Gary Burgess
 * Licensed under the MIT license.
 */

"use strict";

var path = require("path");

module.exports = function (grunt) {

    var flagOptions = {
        magicDo: "--magic-do",
        noPrelude: "--no-prelude",
        runMain: "--run-main",
        runtimeTypeChecks: "--runtimeTypeChecks",
        tco: "--tco",
    };

    var compile = function (dest, src, options, callback) {
       
        // Use the input file list as the initial arguments
        var args = src.filter(function (filepath) {
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn("Source file \"" + filepath + "\" not found.");
                return false;
            } else {
                return true;
            }
        });
        
        // Add any option flags
        for (var k in flagOptions) {
            if (flagOptions.hasOwnProperty(k)) {
                if (options[k] === true) {
                    args.push(flagOptions[k]);
                }
            }
        }
        
        // Ensure the output directory exists as psc doesn't create it
        grunt.file.mkdir(path.dirname(dest));
        
        // Add the destination file output argument
        args.push("--output=" + dest);
        
        // Run the compiler
        return grunt.util.spawn({
            cmd: "psc",
            args: args,
            options: { cwd: process.cwd() }
        }, function (err, result) {
            if (err) {
                grunt.log.error("Error creating file " + dest);
                grunt.log.error(result.stdout);
                callback(err);
            } else {
                grunt.log.ok("Created file " + dest + ".");
                callback();
            }
        });
    
    };

    grunt.registerMultiTask("purescript", "Compile PureScript files.", function () {

        var options = this.options({
            magicDo: false,
            noPrelude: false,
            runMain: false,
            runtimeTypeChecks: false,
            tco: false
        });

        var callback = this.async();
        var files = this.files;

        var compileNext = function (err) {
            if (err) {
                callback(err);
            } else if (files.length === 0) {
                callback();
            } else {
                var file = files.pop();
                compile(file.dest, file.src, options, compileNext);
            }
        };

        compileNext();

    });
  
};
