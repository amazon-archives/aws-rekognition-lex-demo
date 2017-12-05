#! /usr/bin/env node
var Promise=require('bluebird')
var config=require('../config')

var aws = require('aws-sdk')
aws.config.region=config.region
aws.config.maxRetries=10
aws.config.setPromisesDependency(Promise)

module.exports=aws
