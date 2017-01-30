## Getting Started

1. Install local dependencies from package.json:  `npm install`
2. Install Protractor globally: `npm install protractor -g`
3. Install protractor flake globally `npm install protractor-flake -g`
4. Set your environment variables (see environment variables section)

5. Running Protractor (from the root wstamp dir)
 -- To run each test one time: `protractor protractor.conf.js`
 -- To rerun flaky tests up to 3 times: `protractor-flake`

## Environment Variablesls

You can set environment variables using a .env file in this project root. See [dotenv](https://github.com/motdotla/dotenv). Note that this file is ignored by git.

To run the wstamp tests, you need to set environment variables for: 
- WSTAMP_USERNAME
- WSTAMP_PASSWORD

By default, protractor will spin up a local selenium server, however to use saucelabs or browserstack, set either SAUCE_USERNAME & SAUCE_KEY or BROWSERSTACK_USERNAME & BROWSERSTACK_KEY.

If you would like to use saucelabs or browserstack, you will also need to uncomment out their respective references in the conf.js file.

## Design Patterns

### Page Object Design Patterns
- Tests should be expressive and not cluttered with implementation details
- PageObjects should hold reusable properties / methods that abstract away the page interactions


## Good References
- http://www.protractortest.org/#/
- https://github.com/qualityshepherd/protractor-example
- https://github.com/NickTomlin/protractor-flake
- https://github.com/bcaudan/jasmine-spec-reporter

## Load Testing

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

