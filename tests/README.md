# Deliteful Tests

This directory contains the Deliteful widgets tests.

##### Table of content

- [Directory stucture](#directory-structure)
- [Initial setup](#initial-setup)
- [Running the tests](#running-the-tests)
- [Writing tests](#writing-tests)

## Directory Structure

Deliteful has two sets of automated tests, implemented using [the Intern](https://github.com/theintern/intern):

- `Unit tests`, that are under the [unit](./unit) directory. The [unit/all.js](./unit/all.js) file references all the available unit tests.
- `Functional tests` (webdriver tests), that are under the [functional](./functional) directory. The [functional/all.js](./functional/all.js) file references all the available functional tests. 

The unit tests are lightweight, run inside a browser page and do not simulate real interaction between a user and the browser window.
The functional tests, in comparison, takes longer to run but do simulate real interactions between a user and the browser window.

Four configuration files defines the four [intern configurations](https://github.com/theintern/intern/wiki/Configuring-Intern) that are available to run the automated tests from the command line:
- [intern.local.js](./intern.local.js) define a configuration that runs the tests locally, on desktop browser, on you computer.
- [intern.local.android.js](./intern.local.android.js) define a configuration that runs the tests locally, on android devices, on you computer.
- [intern.local.ios.js](./intern.local.ios.js) define a configuration that runs the tests locally, on ios devices, on you computer.
- [intern.js](./intern.js) define a configuration that runs the tests on [Sauce Labs](https://saucelabs.com/), providing that you have a valid Sauce Labs use account.

Note that as intern provides an in browser runner for the unit tests, you can also run the unit tests in a browser without using the command line.

## Initial Setup

To be able to run the deliteful automated tests, you need to:

1. Install the Intern
1. If running the tests on Sauce Labs, create an account and setup your environment to use it
1. If running the tests locally on desktop browsers, you will have to install [selenium](http://www.seleniumhq.org/) and drivers for the browsers that you want to use
1. If running the tests locally on android devices, you will have to install [selendroid](http://selendroid.io) and the [Android SDK](http://developer.android.com/sdk/index.html?hl=sk)
1. If running the tests locally on ios devices, you will have to install [appium](http://appium.io) and [XCode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12), on a Mac OS X platform

#### Installing the Intern

To install the Intern for the deliteful project, you need to run the following command in the deliteful home directory:

```
$ npm install
```

That will install all the dependencies of deliteful, including the Intern. You only need to run this command once.

#### Sauce Labs configuration

If you don't already have a Sauce Labs account, you can create one on their website, choosing the scheme that best fit your situation (Note that they ofer a free one for OSS developpers, [Open Sauce](https://saucelabs.com/opensauce)):

1. Navigate to https://saucelabs.com/signup in your browser;
2. Select the subscription plan you want and fill up the form to create your account.

Once your account has been created, setup your `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables as they are listed
on https://saucelabs.com/appium/tutorial/3.

#### Selenium / Webdriver installation

To run the tests locally (which is faster than running the tests on Sauce Labs but restricts the list of browsers the test run into to the list of browsers
that are installed on your computer), you first need to install the following resources:

1. Java JRE version 6
1. From the [Selenium download page](http://www.seleniumhq.org/download/):
  1. Selenium Server
  1. Drivers for the browsers installed on your computer. After you've downloaded the browser drivers, make sure that they are referenced in your $PATH (or %PATH% on Windows):
    1. Firefox driver: included with Selenium Server, no extra download needed
    1. Internet explorer driver: use the link provided in section _The Internet Explorer Driver Server_ of http://www.seleniumhq.org/download/
    1. Chrome driver: https://code.google.com/p/chromedriver/
    1. Safari driver: included with Selenium Server, no extra download needed

#### Selendroid / Android SDK installation

To run the tests locally on android emulators or android devices, you first need to install the following resources:

1. Java SDK version 6
1. [Android SDK](http://developer.android.com/sdk/index.html).
    1. Once the Android SDK is installed, use the [SDK Manager](http://developer.android.com/tools/help/sdk-manager.html) to download an install Android 4.4 and Android 4.3 platforms.
    1. You may then [set up virtual devices](http://developer.android.com/tools/devices/managing-avds.html) to use as test platforms: one with Android 4.4, another one with Android 4.3.
1. [Selendroid standalone with dependencies](http://selendroid.io)

#### Appium / XCode installation

To run the tests locally on ios emulators or ios devices, you first need to install the following resources:

1. [XCode 5](https://itunes.apple.com/us/app/xcode/id497799835?mt=12), from the Mac App Store
    1. Once XCode 5 is installed, install additional iOS Simulator (iOS 7 and iOS 6.1) with the following procedure:
        1. Launch XCode
        1. Click the `XCode -> Preferences...` menu entry
        1. Click the `Downloads` toolbar button
        1. Under `Components` select and download _iOS 7.0 Simulator_ and _iOS 6.1 Simulator_
1. Install Appium with Node.js package manager:
    1. `npm install -g appium`
    1. authorize use of the iOS Simulator by running the following command: `sudo authorize_ios` (see [Appium documentation](http://appium.io/slate/en/v1.0.0/#system-setup-(ios)) for more info).

## Running the tests

You have five options to run the tests:

1. Run the unit tests in a single browser
1. Run both unit and functional tests locally in desktop browsers
1. Run both unit and functional tests locally in android browsers (emulators or real devices)
1. Run both unit and functional tests locally in iOS browsers (emulators or real devices)
1. Run both unit and functional tests in Sauce Labs browsers

When running tests using the command line, you can also adjust the list of reports generated for the test execution.

### Running the unit tests in a browser

To run the unit tests in a single browser, make sure that your `deliteful` checkout is accessible through a web server at `http://SERVER:PORT/PATH` and open the following URL in a test browser:

```
http://SERVER:PORT/PATH/node_modules/intern/client.html?config=tests/intern
```

Note that this won't run the functional tests, and that you will have to check the browser javascript console to get the tests execution result.

### Running the unit and functional tests locally in desktop browsers

1. Starts the selenium server on the default port (4444) (requires selenium server. See [installation instructions](#selenium--webdriver-installation)):

   ```
   $ java -jar selenium-server-standalone-2.XX.0.jar
   ```

2. Edit the [intern.local.js](./intern.local.js) configuration to list which browsers to use for the tests

3. In the deliteful directory, type the following command:

   ```
   $ grunt test:local
   ```

### Running the unit and functional tests in android browsers

`Note: this does not document how to run the test on real devices, which will come in a further update of this documentation`

1. Starts the selendroid server on the default port (4444) (requires selendroid and android SDK. See [installation instructions](#selendroid--android-sdk-installation)):

   ```
   $ java -jar selendroid-standalone-X.Y.Z-with-dependencies.jar
   ```

1. Edit the [intern.local.android.js](./intern.local.android.js) configuration to set up the `host` variable to your local IP address  

1. In the deliteful directory, type the following command:

   ```
   $ grunt test:local.android
   ```
 
### Running the unit and functional tests in iOS browsers

`Note: this does not document how to run the test on real devices, which will come in a further update of this documentation`

1. Starts appium (requires appium and XCode. See [installation instructions](#appium--xcode-installation)):

   ```
   $ appium &
   ```

1. Edit the [intern.local.ios.js](./intern.local.ios.js) configuration to set up the `host` variable to your local IP address  

1. In the deliteful directory, type the following command:

   ```
   $ grunt test:local.ios
   ```

### Running the unit and functional tests in Sauce Labs browsers

In the deliteful directory, type the following command (requires Sauce Labs environment variables. See [Sauce Labs configuration instructions](#sauce-labs-configuration)):

```
$ grunt test:remote
```

Note that you can update the [intern.js](./intern.js) configuration file if you need to customize the list of browsers to run the tests into.

To monitor the tests execution and access the Sauce Labs reports, you will need to [login to Sauce Labs](https://saucelabs.com/login). 

### Adjusting reports

Optional reports can be added via grunt flags e.g.

    $ grunt test:local:console // run the console reporter for a local test
    $ grunt test:remote:lcovhtml // run the console reporter for a remote (saucelabs) test with the lcovhtml coverage reporter
    $ grunt test:local:console:lcovhtml // multiple reporters can be specified

The following reporters are currently provided as optional flags
   * `lcovhtml`: this HTML report is generated at `deliteful/html-report/index.html` and provides detailed information about what sections of the widgets code are executed during the tests and, more importantly, what sections are not.
   * `console`

## Writing tests

WORK IN PROGRESS (see https://github.com/theintern/intern/wiki/Writing-Tests-With-Intern for a general heads up on writing tests with the Intern).
