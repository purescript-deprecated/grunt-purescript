/*
 * grunt-purescript
 * https://github.com/purescript/grunt-purescript
 *
 * Copyright (c) 2014 Gary Burgess
 * Licensed under the MIT license.
 */

"use strict";

var semver = require("semver");

module.exports = function (grunt) {

    var spawnPscDocs = function(args, callback) {
        grunt.util.spawn({
            cmd: "psc-docs",
            args: args,
            options: { cwd: process.cwd() }
        }, callback);
    };

    var checkVersion = function(callback) {
        spawnPscDocs(["--version"], function(err, result) {
            if (err) {
                grunt.log.error("Error creating documentation:");
                callback(err);
                return;
            }

            var version = result.stdout.slice(0, 5);
            if (semver.satisfies(version, ">= 0.7.0")) {
                callback();
            } else {
                var msg = "This version of grunt-purescript requires " +
                            "psc-docs version 0.7.0.0 or greater.";
                grunt.log.error(msg);
                callback(new Error(msg));
            }
        });
    };

    var compile = function (src, docgen, callback) {
        checkVersion(function(err) {
            if (err) {
                callback(err);
                return;
            }

            var srcArgs = src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn("Source file \"" + filepath +
                                        "\" not found.");
                    return false;
                } else {
                    return true;
                }
            });

            var docgenArgs = [];
            for (var m in docgen) {
                if (docgen.hasOwnProperty(m)) {
                    docgenArgs.push("--docgen");
                    docgenArgs.push(m + ":" + docgen[m]);
                }
            }

            spawnPscDocs(srcArgs.concat(docgenArgs), function(err) {
                if (err) {
                    grunt.log.error("Error creating documentation:");
                    callback(err);
                } else {
                    grunt.log.ok("Created module documentation:");
                    for (var m in docgen) {
                        if (docgen.hasOwnProperty(m)) {
                            grunt.log.ok(m + " -> " + docgen[m]);
                        }
                    }
                    callback();
                }
            });
        });

    };

    grunt.registerMultiTask("pscDocs", "Generate markdown documentation for PureScript modules.", function () {

        var options = this.options();
        var callback = this.async();

        if (!options.hasOwnProperty("docgen")) {
            grunt.log.error("The 'docgen' option is missing.");
            return callback(false);
        }

        compile(this.filesSrc, options.docgen, callback);

    });

};
