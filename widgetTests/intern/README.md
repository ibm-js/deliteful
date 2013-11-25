# DUI Infrastructure Unit Tests

This directory contains the DUI widgets (to be renamed as "deliteful") unit tests.

## Setup

Before starting, install Intern by running

```
$ npm install
```

Also, if you are going to run against Sauce Labs, then
setup your SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables as they are listed
on https://saucelabs.com/appium/tutorial/3.


## Running the unit tests in a browser

Navigate to:

```
http://localhost/dui/node_modules/intern/client.html?config=tests/intern/client
```

Note that this won't run the functional tests.


## Running the unit and functional tests in Sauce Labs

On Mac/Linux:

```
$ ./runsauce.sh
```

Or on Windows (untested):

```
cd ..\..\..
node dui\node_modules\intern\runner.js config=dui\tests\intern\sauce.js
```

## Running the unit and functional tests locally

1) Download selenium server 2.37.0 (http://www.seleniumhq.org/download/) and start it on the default port (4444):

```
$ java -jar selenium-server-standalone-2.37.0.jar
```

2) Edit local.js to list which browsers to test

3) Run the tests:

```
$ ./runlocal.sh
```

Or on Windows (untested):

```
cd ..\..\..
node dui\node_modules\intern\runner.js config=dui\tests\intern\local.js
```


