## Getting Started
1. cd to the wstamp directory
2. Install local dependencies from package.json:  `npm install`
3. Install Protractor globally: `npm install protractor -g`
4. Install protractor flake globally `npm install protractor-flake -g`
5. Set your environment variables (see environment variables section)
6. Running Protractor (from the root wstamp dir)
 - To run each test one time: `protractor protractor.conf.js`
 - To rerun flaky tests up to 3 times: `protractor-flake`

## Current Status
- Version 1.10 of wstamp added ping functionality using a continuously polling angular $interval that reruns every 10 minutes for authenticated users. This functionality works fine for the user experience, but it makes it impossible to test using standard Protractor functionality because Protractor waits for aysnchronous activity to finish. It would be possible to turn off waiting in Protractor, but then would lose all the advantages of Protractor. Instead, the simple solution is to use angular's $interval instead of $timeout. Protractor knows not to wait for $interval. This is the preffred way of handling continous polling or long single timeouts (greater than 10 seconds).
- Error: - Failed: Timed out waiting for asynchronous Angular tasks to finish after 15 seconds. This may be because the current page is not an Angular application. Please see the FAQ for more details: https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular 


## Environment Variables

You can set environment variables using a .env file in this project root. See [dotenv](https://github.com/motdotla/dotenv). Note that this file is included in .gitignore, so it is not in the repo.

To run the wstamp tests, you need to set environment variables for: 
- WSTAMP_USERNAME
- WSTAMP_PASSWORD

By default, protractor will spin up a local selenium server, however to use saucelabs or browserstack, set either SAUCE_USERNAME & SAUCE_KEY or BROWSERSTACK_USERNAME & BROWSERSTACK_KEY.

If you would like to use saucelabs or browserstack, you will also need to uncomment out their respective references in the conf.js file.

## Best Practices
- Write Unit tests & functional tests. Unit tests are super fast and very specifc. Much easier to determine what went wrong when a unit test fails relative to a functional test.
- Prefer unit tests of e2e tests when possible.
- Should be able to run tests on the development environment before committing code, not just the production version (wstamp). Best if tests are integrated into the CI pipeline.
- Tests should be independent so they can be run in parallel / isolation from all other tests.
- For selectors, use angular models when possible, otherwise ID, class, and use xpath only when necessary. 
- Functional tests are flakey, so use something like protractor-flake to rerun failed tests multiple times when part of a CI pipeline. 

### Page Object Design Patterns
When writing end-to-end tests, a common pattern is to use Page Objects. Page Objects help you write cleaner tests by encapsulating information about the elements on your application page. A Page Object can be reused across multiple tests, and if the template of your application changes, you only need to update the Page Object.

- Tests should be expressive and not cluttered with implementation details
- PageObjects should hold reusable properties / methods that abstract away the page interactions.
- Whenever the login process (for example) changes, this should be updated in one place -> the login page object and not in every test that references logins. 
- Generally don't make assertions in the page objects
- Page objects dont need to represent an entire page. They can represent page components.


## WSTAMP Issues
- On standard laptop screen resolutions (1280x720 tested) , the tutorial's analyze page step doesnt fit on the screen. This is an issue because the end tour button is not visible. The only way to close the tutorial is to zoom out and then click End Tour. This can be easily fixed by setting the width of the tour-step popovers to be a bit wider.
- There are timeout issues associated with clicking a parent attribute Stamps in the attribute Panel and then selecting a child/children attributes. The user experience is fine, and everything flows through, but this causes issues with Protractor testing because async angular processes never terminate. Not sure if there is continuous polling via $timeout instead of $interval, but was forced to ignore synchronization to make this work. See this [link](https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular) for more info.
- There are browser console errors on the landing page. For example: `no chart was found with displayText: Time series with outliers` and `no chart found to match:
{"definitionName":"timeSeries","displayText":"Time series with outliers","configData":{"shouldDrawBoxes":true,"locoObjs":null,"attrPrim":null,"TimeMM":null}}`. These issues should be fixed.

## Good References
- http://www.protractortest.org/#/
- https://github.com/qualityshepherd/protractor-example
- https://github.com/NickTomlin/protractor-flake
- https://github.com/bcaudan/jasmine-spec-reporter



## Saucelabs vs BrowserStack vs local
- Remote Selenium Grids (S & BS) are great for testing multiple browser/os combinations in parallel. Video playback when test finsihed.
- If only testing Chrome/Firefox and not too many parallel tests might be best to test locally.
- Local tests can't run as many in parallel.

Saucelabs
- 149/month for 1000 min of testing, 2 concurrent tests, 50 users
- 299/month for 2000 min of testing, 4 concurrent tests, 50 users
- 399/month for 3000 min of testing, 6 concurrent tests, 50 users

BrowserStack
- 99/month for unlimited testing, 1 concurrent test, 1 user
- 199/month for unlimited testing, 2 concurrent tests, 2 users
- 499/month for unlimited testing, 5 concurrent tests, 5 users
- 149/month for 1000 min of testing, 2 concurrent tests, 5 users
- 299/month for 2000 min of testing, 4 concurrent tests, 10 users


## Load Testing
Saucelabs does not recommend using their service for load testing because there are much, much cheaper ways to simulat a large number of parallel users. Instead, here are some load testing services:

1. BlazeMeter
- Free: 50 concurrent users, 10 total tests
- $99/month: 1000 users, 200 tests/year
- $499/month: 3000 users, 250 tests/year

2. LoadImpact
- Free: 100 users, 5 tests/month
- $89/month: 500 users, 15 tests/month  
- $224/month: 2000 users, unlimited test/month

3. Loader.io
- Free: 10,000 users, unlimited tests < 1 min
- $99/month: 100,000 users, unlimited tests < 10 min