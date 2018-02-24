# [Sandbox](https://blowerio-sms-sandbox.herokuapp.com/) for [Blower.io](https://elements.heroku.com/addons/blowerio) SMS

[![Build Status](https://travis-ci.org/KillWolfVlad/blowerio-sms-sandbox.svg?branch=master)](https://travis-ci.org/KillWolfVlad/blowerio-sms-sandbox)

Use this environment for your tests

```
BLOWERIO_URL=https://blowerio-sms-sandbox.herokuapp.com/api/v0
```

## POST `BLOWERIO_URL/messages`

Header         | Value
-------------- | -----------------------------------
`content-type` | `application/x-www-form-urlencoded`
`accepts`      | `application/json`

Body      | Value (example) | Type
--------- | --------------- | ------
`to`      | `+79123456789`  | string
`message` | `Sandbox!`      | string

Status: `201` if the message was successfully sent

Visit [official documentation](https://devcenter.heroku.com/articles/blowerio) to find more information about API

## Environment variables (for sandbox developers)

Name             | Value (example)                               | Type    | Description                                                                 | Required on Heroku?
---------------- | --------------------------------------------- | ------- | --------------------------------------------------------------------------- | --------------------------------------
DEBUG            | "blowerio"                                    | string  | Debug messages                                                              | No
NODE_ENV         | "production" or "staging"                     | string  | Node.js environment                                                         | No
BODYPARSER_LIMIT | "100kb"                                       | string  | Maximum request body size (in https://www.npmjs.com/package/bytes notation) | Yes
PORT             | 8080                                          | number  | Web application port                                                        | No
DATABASE_URL     | "postgresql://dbuser:secret@server:3211/mydb" | string  | Database url                                                                | [Yes](https://www.heroku.com/postgres)
DATABASE_MAX     | 20                                            | number  | Maximum number of clients the pool should contain                           | Yes
DATABASE_SSL     | true                                          | boolean | Use secure connection?                                                      | Should be `true`
ROOT_PASSWORD    | "qwerty"                                      | string  | Password for root access                                                    | Yes
