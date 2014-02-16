# grunt-purescript

> Runs the [PureScript](https://github.com/purescript/purescript) compiler to produce JavaScript files.

## Getting started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-purescript --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-purescript');
```

## The "purescript" task

### Overview
In your project's Gruntfile, add a section named `purescript` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  purescript: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.browserNamespace
Type: `String`
Default value: `PS`

Invokes the `--browser-namespace` compiler flag with the specified argument. Specifies the namespace that PureScript modules will be exported to when running in the browser.

#### options.externs
Type: `String`
Default value: none

Invokes the `--externs` compiler flag with the specified argument. Generates a `.e.ps` file for foreign imports.

#### options.magicDo
Type: `Boolean`
Default value: `false`

Toggles the `--magic-do` compiler flag. Overloads the `do` keyword to inline calls to `>>=` for the `Eff` monad to generate more efficient code when enabled.

#### options.noOpts
Type: `Boolean`
Default value: `false`

Toggles the `--no-opts` compiler flag. Skips the optimization phase for the generated JavaScript when enabled.

#### options.noPrelude
Type: `Boolean`
Default value: `false`

Toggles the `--no-prelude` compiler flag. Omits the Prelude from the generated JavaScript when enabled.

#### options.main
Type: `Boolean` or `String`
Default value: `false`

Toggles the `--main` compiler flag. Can be set to `true` or the name of a module in which a `main` function resides. When enabled, a call to `main` will be added after all other generated JavaScript. When set to `true`, the module name will be assumed to be `Main`.

#### options.modules
Type: `String` or `Array`
Default value: none

Enables dead code elimination, ensuring that the named module (or list of modules) are included in the generated JavaScript, along with all their dependencies.

#### options.runtimeTypeChecks
Type: `Boolean`
Default value: `false`

Toggles the `--runtime-type-checks` compiler flag. Generates simple runtime type checks for function arguments with simple types when enabled.

#### options.tco
Type: `Boolean`
Default value: `false`

Toggles the `--tco` compiler flag. Performs tail-call elimination on the generated JavaScript when enabled.

### Usage examples

```js
purescript: {

    compile: {
        files: {
            "path/to/purescript/output.js": "path/to/source/**/*.purs",
        }
    },

    compileWithOptions: {
        options: {
            magicDo: true,
            tco: true,
            main: "App"
        },
        files: {
            "path/to/purescript/output.js": "path/to/source/**/*.purs",
        }
    }
}
```
