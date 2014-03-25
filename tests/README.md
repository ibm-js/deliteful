# Deliteful Tests

This directory contains the Deliteful widget tests.

##### Table of content

- [Directory stucture](#structure)
- [Running the tests](#running)
- [Writing tests](#writing)

<a name="#structure"/>
## Directory Structure

Deliteful has two sets of automated tests, implemented using [Intern](https://github.com/theintern/intern):

- `Unit tests`, that are under the [unit](./unit) directory. The [unit/all.js](./unit/all.js) file references all the available unit tests.
- `Functional tests` (webdriver tests), that are under the [functional](./functional) directory. The [functional/all.js](./functional/all.js) file references all the available functional tests. 

The unit tests are lightweight, runs into a browser and do not simulate real interaction between a user and the browser window.
The functional tests, in comparison, takes longer to run but do simulate real interactions between a user and the browser window.

Two configuration files defines the two [intern configurations](https://github.com/theintern/intern/wiki/Configuring-Intern) that are available to run the automated tests from the command line:
- [intern.local.js](.\intern.local.js) define a configuration that runs the tests locally, on you computer.
- [intern.js](.\intern.js) define a configuration that runs the tests on Sauce Labs, providing that you have a valid Sauce Labs use account.

<a name="#running"/>
## Running the tests

### Setup

To be able to run the deliteful tests, you need to:

    * Install the Intern
    * If you want to run the tests against browsers using a Sauce Labs account, you need to 
Before starting, install Intern by running

```
$ npm install
```

Also, if you are going to run against Sauce Labs, then
setup your SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables as they are listed
on https://saucelabs.com/appium/tutorial/3.



### Running the unit tests in a browser

Navigate to:

```
http://localhost/deliteful/node_modules/intern/client.html?config=tests/client
```

Note that this won't run the functional tests.


### Running the unit and functional tests in Sauce Labs

In the deliteful directory:

```
$ grunt test:remote
```

### Running the unit and functional tests locally

1) Download selenium server (http://www.seleniumhq.org/download/) and start it on the default port (4444):

```
$ java -jar selenium-server-standalone-2.38.0.jar
```

2) Edit intern.local.js to list which browsers to test

3) In the deliteful directory:

   ```
   $ grunt test:local
   ```


### Adjusting reports

Optional reports can be added via grunt flags e.g.

    $ grunt test:local:console // run the console reporter for a local test
    $ grunt test:remote:lcovhtml // run the console reporter for a remote (saucelabs) test with the lcovhtml coverage reporter
    $ grunt test:local:console:lcovhtml // multiple reporters can be specified

Currently only the reporters are provided as optional flags
   * lcovhtml
   * console

<a name="#writing"/>
## Writing tests