# DUI Infrastructure Unit Tests

This directory contains the DUI unit tests (to be renamed as "delite").

Before starting, install Intern (https://github.com/theintern/intern#quick-start),
using the parent directory of your dui checkout as the installation directory:

```
$ cd ../../..
$ npm install intern --save-dev
```


## Running the unit tests in a browser

Navigate to:

```
http://localhost/node_modules/intern/client.html?config=dui/tests/infrastructure/sauce
```

Note that this won't run the functional tests.

## Running the unit and functional tests in Sauce Labs

On Mac/Linux:

```
$ sh ./runsauce.sh
```

On Windows (untested):

```
cd ..\..\..
node node_modules\intern\runner.js config=dui\tests\infrastructure\sauce.js
```

## Running the unit and functional tests locally

1) Install selenium server 2.37.0 (http://www.seleniumhq.org/download/) and start it on the default port (4444):

```
$ java -jar selenium-server-standalone-2.37.0.jar
```

2) Edit local.js to list which browsers to test

3) Run the tests:

```
$ node /my/project/root/node_modules/intern/runner.js config=dui/tests/infrastructure/local.js
```

