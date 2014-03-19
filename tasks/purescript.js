/*
 * grunt-purescript
 * https://github.com/purescript/grunt-purescript
 *
 * Copyright (c) 2014 Gary Burgess
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {

    var flagOptions = {
        magicDo: "--magic-do",
        noOpts: "--no-opts",
        noPrelude: "--no-prelude",
        runtimeTypeChecks: "--runtime-type-checks",
        tco: "--tco"
    };

    var argumentOptions = {
        browserNamespace: "--browser-namespace",
        externs: "--externs",
    };

    var compile = function (dest, src, options, callback) {
    
        // Get source file and common command line arguments
        var args = getDefaultArgs(src, options);

        // Add modules to be kept after dead code elimination
        if (options.modules) {
            if (typeof options.modules === "string") {
                args.push("--module=" + options.modules);
            } else {
                options.modules.forEach(function (module) {
                    args.push("--module=" + module);
                });
            }
        }

        // Add the main module argument
        if (options.main) {
            if (options.main === true) {
                args.push("--main");
            } else {
                args.push("--main=" + options.main);
            }
        }

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

    var make = function (src, options, callback) {
    
        // Get source file and common command line arguments
        var args = getDefaultArgs(src, options);

        // Run the compiler
        return grunt.util.spawn({
            cmd: "psc-make",
            args: args,
            options: { cwd: process.cwd() }
        }, function (err, result) {
            if (err) {
                grunt.log.error("Make failed:");
                grunt.log.error(result.stdout);
                callback(err);
            } else {
                grunt.log.ok("Make was successful.");
                callback();
            }
        });

    };

    var getDefaultArgs = function(src, options) {

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
        for (var flag in flagOptions) {
            if (flagOptions.hasOwnProperty(flag)) {
                if (options[flag] === true) {
                    args.push(flagOptions[flag]);
                }
            }
        }

        // Add any option arguments
        for (var arg in argumentOptions) {
            if (argumentOptions.hasOwnProperty(arg)) {
                if (typeof options[arg] === "string") {
                    args.push(argumentOptions[arg] + "=" + options[arg]);
                }
            }
        }

        return args;
    };

    grunt.registerMultiTask("purescript", "Compile PureScript files.", function () {

        var options = this.options();

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

    grunt.registerMultiTask("purescript-make", "Compile PureScript files in make mode.", function () {

        var options = this.options();

        var callback = this.async();
        var files = this.files;

        var compileNext = function (err) {
            if (err) {
                callback(err);
            } else if (files.length === 0) {
                callback();
            } else {
                var file = files.pop();
                make(file.src, options, compileNext);
            }
        };

        compileNext();
    });

};
