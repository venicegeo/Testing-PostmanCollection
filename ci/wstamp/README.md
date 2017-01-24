## Getting Started

1. Install local dependencies from package.json:  `npm install`
2. Install Protractor globally: `npm install protractor -g`
3. Set your environment variables (see environment variables section)
4. Run protractor `protractor conf.js`

## Environment Variables
You can set environment variables using a .env file in this project root. See [dotenv](https://github.com/motdotla/dotenv). Note that this file is ignored by git.

To run the wstamp tests, you need to set environment variables for: 
- WSTAMP_USERNAME
- WSTAMP_PASSWORD

By default, protractor will spin up a local selenium server, however to use saucelabs or browserstack, set either SAUCE_USERNAME & SAUCE_KEY or BROWSERSTACK_USERNAME & BROWSERSTACK_KEY.

If you would like to use saucelabs or browserstack, you will also need to uncomment out their respective references in the conf.js file.
