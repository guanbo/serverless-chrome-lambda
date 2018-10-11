# Serverless Chrome Lambda

A collection of [Serverless-framework](https://github.com/serverless/serverless) based functions for AWS Lambda demonstrating the `serverless-plugin-chrome` plugin for Serverless to run Headless Chrome serverless-ly. The example functions include:
  - A Print to PDF handler
  - ~~A Capture Screenshot handler~~
  - ~~A Page-load Request Logger handler~~
  - ~~A Version Info handler (💤 )~~


## Contents
1. [Installation](#installation)
1. [Credentials](#credentials)
1. [Deployment](#deployment)
1. [Functions](#functions)
1. [Development](#development)
1. [Configuration](#configuration)


## Installation

First, install `serverless` globally:

```bash
npm install serverless -g
```

And install the dependencies:

```bash
npm install
```

## Credentials

_We recommend using a tool like [AWS Vault](https://github.com/99designs/aws-vault) to manage your AWS credentials._

You must configure your AWS credentials either by defining `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environmental variables, or using an AWS profile. You can read more about this on the [Serverless Credentials Guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

In short, either:

```bash
export AWS_PROFILE=<your-profile-name>
```

or

```bash
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

## Deployment

Once Credentials are set up, to deploy the full service run:

```bash
npm run deploy
```

## Functions

### Print a given URL to PDF
The printToPdf handler will create a PDF from a URL it's provided. You can provide this URL to the Lambda function via the AWS API Gateway. After a successful deploy, an API endpoint will be provided. Use this URL to call the Lambda function with a url in the query string. E.g. `https://XXXXXXX.execute-api.us-weeast-2.amazonaws.com/dev/pdf?url=https://github.com/adieuadieu/serverless-chrome`

This handler also supports configuring the "paper" size, orientation, etc. You can pass any of the DevTools Protocol's [`Page.printToPdf()`](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF]) method's parameters. For example, for landscape oriented PDF add `&landscape=true` to the end of the URL. Be sure to remember to escape the value of `url` if it contains query parameters. E.g. `https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/pdf?url=https://github.com/adieuadieu/serverless-chrome&landscape=true`

#### Deploying

To deploy the Capture Screenshot function:

```bash
serverless deploy -f pdf
```
## Development  

Chromium docker start

```shell
docker run -d --rm --name headless-chromium -p 9222:9222 adieuadieu/headless-chromium-for-aws-lambda
```

Unit test

```shell
node_modules/.bin/mocha --opts test/mocha.opts --exit src/**/*.spec.js
```

Accept test

```shell
npm test
```


## Configuration

These are simple functions and don't offer any configuration options. Take a look at the `serverless-plugins-chrome` plugin's [README](https://github.com/adieuadieu/serverless-chrome/tree/master/packages/serverless-plugin) for it's configuration options.



[more chromium detail](https://github.com/adieuadieu/serverless-chrome/blob/master/docs/chrome.md)

