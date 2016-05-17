# exchange-rate-worker [![Build Status](https://travis-ci.org/sabrinaluo/DQICAw8ADQcJBgIMBAEAAg.svg?branch=master)](https://travis-ci.org/sabrinaluo/DQICAw8ADQcJBgIMBAEAAg)

## Start
```
npm start
```
This app will read `NODE_ENV`, if it is undefined, `./config/dev.json` is used by default.

Alias for variable is supported, and it is NOT case sensitive.

|env|alias|
|:---|:---|
|dev|develop|
|prod|production|

## Test
```
npm test
```

## Log
Use [bunyan](https://github.com/trentm/node-bunyan) as logger.
For production, logs will be stored in `./logs`

## CI
Travis, see `.travis.yml`

## TODO
- Split unit test and integration test
- Add more test case

## Question
Sinon.js is not supporting es6 features, if `yield` is used in origin function, it's difficult to test. Any other tools can be used for the similar purpose?

## Miscellaneous
- Why crawling xe.com?
Most of the free APIs update every hour or even longer, and may have GET limitations.[^1]
xe.com website updates every minute.

- UI Tools
  - [Beanstalkd Dashboard](https://chrome.google.com/webstore/detail/beanstalkd-dashboard/dakkekjnlffnecpmdiamebeooimjnipm)
  - [mongo-express](https://github.com/mongo-express/mongo-express)

## Credit
- am9ic0BhZnRlcnNoaXAuY29t
- rR4h7C2JGUaHy2GwiaS2WA
- am9ic0BhZnRlcnNoaXAuY29t
- VHX9X19GEESwcvS1qB3aTw
- j4eH_7er-kOaOcCsuU3i8g

[^1]: http://www.freecurrencyconverterapi.com/comparison
