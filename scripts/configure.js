#!/usr/bin/env node
'use strict'

const fs = require('fs')
const exec = require('child_process').execSync
const utils = require('./utils');

const args = require('minimist')(process.argv.slice(2), {
    string: [
        'account-id',
        'bucket-name',
        'function-name',
        'region',
        'version'
    ],
    default: {
        region: 'us-east-1',
        'function-name': 'AWSLambdaFunction',
        version: 'development'
    }
})

const version = args.version;
const accountId = args['account-id'];
const bucketName = args['bucket-name'];
const functionName = utils.yamlName(args['function-name']); // this-Is_a_1234Name -> thisIsaName 
const friendlyName = utils.lambdaName(args['function-name']); // this-Is_a_1234Name -> this-IsaName 
const region = args.region
const availableRegions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2']

if (!accountId || accountId.length !== 12) {
    console.error('You must supply a 12 digit account id as --account-id="<accountId>"')
    return
}

if (!bucketName) {
    console.error('You must supply a bucket name as --bucket-name="<bucketName>"')
    return
}

if (availableRegions.indexOf(region) === -1) {
    console.error(`Amazon API Gateway and Lambda are not available in the ${region} region. Available regions: us-east-1, us-west-2, eu-west-1, eu-central-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2`)
    return
}


console.log('accountId', accountId);
console.log('region', region);
console.log('version', version);
console.log('functionName', functionName);
console.log('bucketName', bucketName);
console.log('friendlyName', friendlyName);



utils.modifyFiles(['./templates/simple-proxy-api.json', './templates/package.json', './templates/cloudformation.json'], [{
    regexp: /YOUR_ACCOUNT_ID/g,
    replacement: accountId
}, {
    regexp: /YOUR_AWS_REGION/g,
    replacement: region
},
{
    regexp: /YOUR_API_GW_STAGE/g,
    replacement: version
},
{
    regexp: /YOUR_API_GW_NAME/g,
    replacement: functionName+'_ApiGateway'
},
{
    regexp: /YOUR_UNIQUE_BUCKET_NAME/g,
    replacement: bucketName
}, {
    regexp: /YOUR_FRIENDLY_LAMBDA_NAME/g,
    replacement: friendlyName
}, {
    regexp: /YOUR_TECHNICAL_LAMBDA_NAME/g,
    replacement: functionName
}])


//YOUR_API_GW_STAGE
//YOUR_API_GW_NAME

// YOUR_TECHNICAL_LAMBDA_NAME
// YOUR_FRIENDLY_LAMBDA_NAME

/** YOUR_LAMBDA_ENV_VARIABLES_HERE
      Environment:
        Variables:
            XXX: 'yyy'
**/