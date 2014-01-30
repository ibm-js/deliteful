# deliteful

This project provides a predefined set of components working both on desktop and mobile platforms.

One goal of the project is to
[converge the dijit and dojox/mobile widgets](https://docs.google.com/document/d/1_kgrX25ylxuhtZCRrqAoABMaSdgxjAQgpyd0Ap4xvZU/edit#)
into a single set of components.

Another is to
[build on emerging web standards](https://docs.google.com/document/d/1kqe3Oq7W6lg-JY_iqMl5G7SxGTD0uQ6FFIoP4KPAkUw/edit#heading=h.ct7kwnepj0cc).

## Status

No official release yet.

## Migration

This is a merge of the former dijit & dojox/mobile project.

Migration will require manual steps listed [here](docs/migration.md).

## Issues

Bugs and open issues are tracked in the
[github issues tracker])(https://github.com/ibm-js/deliteful/issues).

## Licensing

This project is distributed by the Dojo Foundation and licensed under the ["New" BSD License](https://github.com/dojo/dojo/blob/master/LICENSE#L13-L41).
All contributions require a [Dojo Foundation CLA](http://dojofoundation.org/about/claForm).

## Dependencies

This project requires the following other projects to run:
 * dojo
 * delite
 * dpointer
 * dcl    (git clone https://github.com/uhop/dcl.git)
 * requirejs (git clone https://github.com/jrburke/requirejs.git)
 * requirejs-dplugins

## Installation

_Bower_ release installation:

    $ bower install deliteful

_Manual_ master installation:

    $ git clone git://github.com/ibm-js/deliteful.git

Then install dependencies with bower (or manually from github if you prefer to):

	$ cd deliteful
	$ bower install

## Documentation

See the [docs directory](./docs).
