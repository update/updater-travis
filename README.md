<p align="center">

<a href="https://github.com/update/update">
<img height="150" width="150" src="https://raw.githubusercontent.com/update/update/master/docs/logo.png">
</a>
</p>

Update .travis.yml based on preferences.

# updater-travis

[![NPM version](https://img.shields.io/npm/v/updater-travis.svg?style=flat)](https://www.npmjs.com/package/updater-travis) [![NPM monthly downloads](https://img.shields.io/npm/dm/updater-travis.svg?style=flat)](https://npmjs.org/package/updater-travis) [![Build Status](https://img.shields.io/travis/update/updater-travis.svg?style=flat)](https://travis-ci.org/update/updater-travis)

![updater-travis demo](https://raw.githubusercontent.com/update/updater-travis/master/docs/demo.gif)

## Table of Contents

- [What is "Update"?](#what-is-update)
- [What does updater-travis do?](#what-does-updater-travis-do)
- [Getting started](#getting-started)
  * [Install](#install)
  * [Usage](#usage)
  * [Tasks](#tasks)
- [About](#about)
  * [Related projects](#related-projects)
  * [Community](#community)
  * [Contributing](#contributing)
  * [Running tests](#running-tests)
  * [Author](#author)
  * [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## What is "Update"?

[Update](https://github.com/update/update) is a new, open-source developer framework for automating updates of any kind to code projects. All actual updating is done plugins called "updaters", like this one.

Updaters can be run from the command line when [Update's CLI](https://github.com/update/update/blob/master/docs/installing-the-cli.md) is installed globally, or they can be used as building blocks for creating other [updaters](https://github.com/update/update/blob/master/docs/updaters.md).

**For more information:**

* Visit the [update project](https://github.com/update/update)
* Visit the [update documentation](https://github.com/update/update/blob/master/docs/)
* Find [updaters on npm](https://www.npmjs.com/browse/keyword/update-updater) (help us [author updaters](https://github.com/update/update/blob/master/docs/updaters.md))

## What does updater-travis do?

Most updaters do one specific thing. This updater adds a `.travis.yml` file or replaces the `.travis.yml` file in the current working directory using a template defined by you in `~/templates/_travis.yml` (user home on your system), or the generic template in this project's [templates](templates) directory.

## Getting started

### Install

**Installing the CLI**

To run `updater-travis` from the command line, you'll need to install [Update](https://github.com/update/update) globally first. You can do that now with the following command:

```sh
$ npm install --global update
```

This adds the `update` command to your system path, allowing it to be run from any directory.

**Install updater-travis**

Install this module with the following command:

```sh
$ npm install --global updater-travis
```

### Usage

Make sure your work is committed, then run the updater's `default` [task](https://github.com/update/update/blob/master/docs/tasks.md#default-task) with the following command:

```sh
$ update travis
```

**What will happen?**

Upon running `$ update travis` command, this updater's `default` task will be executed, which replaces the `.travis.yml` file in the cwd with the `~/templates/_travis.yml` template defined by you, or the default templates found in [templates/_travis.yml](templates/_travis.yml) in this repository.

_(Note that all dotfile templates are prefixed with an underscore to prevent programs from mistaking them as real files)_

### Tasks

Visit the [documentation for tasks](https://github.com/update/update/blob/master/docs/tasks.md).

## About

### Related projects

* [updater-editorconfig](https://www.npmjs.com/package/updater-editorconfig): Update or add a `.editorconfig` in the current working directory using a template defined by… [more](https://github.com/update/updater-editorconfig) | [homepage](https://github.com/update/updater-editorconfig "Update or add a `.editorconfig` in the current working directory using a template defined by you in `~/templates`, or generic one if a custom template is not defined. This is an Update `updater`, which can be run from the command line when Update is insta")
* [updater-eslint](https://www.npmjs.com/package/updater-eslint): Update a `.eslintrc.json` file based on a template and preferences. This updater can be used… [more](https://github.com/update/updater-eslint) | [homepage](https://github.com/update/updater-eslint "Update a `.eslintrc.json` file based on a template and preferences. This updater can be used from the command line when installed globally, or as a plugin in other updaters.")
* [updater-license](https://www.npmjs.com/package/updater-license): Update the copyright statement and year in a MIT `LICENSE` file. | [homepage](https://github.com/update/updater-license "Update the copyright statement and year in a MIT `LICENSE` file.")

### Community

Are you using [Update](https://github.com/update/update) in your project? Have you published an [updater](https://github.com/update/update/blob/master/docs/updaters.md) and want to share your Update project with the world?

Here are some suggestions!

* If you get like Update and want to tweet about it, please use the hashtag `#updatejs` (not `@`)
* Show your love by starring [Update](https://github.com/update/update) and `updater-travis`
* Get implementation help on [StackOverflow](http://stackoverflow.com/questions/tagged/update) (please use the `updatejs` tag in questions)
* **Gitter** Discuss Update with us on [Gitter](https://gitter.im/update/update)
* If you publish an updater, thank you! To make your project as discoverable as possible, please add the keyword `updateupdater` to package.json.

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.2, on February 28, 2017._