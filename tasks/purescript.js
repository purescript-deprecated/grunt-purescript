/*
 * grunt-purescript
 * https://github.com/purescript/grunt-purescript
 *
 * Copyright (c) 2014 Gary Burgess
 * Licensed under the MIT license.
 */

"use strict";

var path = require("path");

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
        module: "--module"
    };

    var betterTypeof = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    }

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

        // Add any option arguments
        for (var k in argumentOptions) {
            if (argumentOptions.hasOwnProperty(k)) {
                if (betterTypeof(options[k]) === 'String') {
                    args.push(argumentOptions[k] + "=" + options[k]);
                } else if (betterTypeof(options[k]) === 'Array') {
                    var argArray = options[k];
                    for (var i = 0, len = argArray.length; i < len; ++i) {
                        args.push(argumentOptions[k] + "=" + argArray[i]);
                    };
                }
            }
        }

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

};
