#! /usr/bin/env node
var Promise=require('bluebird')
var config=require('../config')

var aws = require('./aws')
var lexruntime = new aws.LexRuntime();

var fs = require('fs')
var ts = require('tailstream')
var play=require('./play')
var exec = require('child_process').exec
var execp = require('promised-exec')
var file=__dirname+'/request.wav'
var noise=__dirname+'/speech.noise-profile'
var REMOVE_REQUEST_FILE = 'rm '+file
var SOX_COMMAND = 'sox -d -t wavpcm -c 1 -b 16 -r 16000 -e signed-integer --endian little - silence 1 0 1% 5 0.3t 2% noisered'+noise+'> '+file
var streaming = false

var ready=execp(__dirname+'/init.sh')
    .catch(x=>console.log('ready'))

module.exports=function(){
    return ready.then(()=>run())
}

function run(){
    var stream
    var result
    var recording = exec(SOX_COMMAND);
    var params = {
        botAlias: '$LATEST',
        botName:config.botname,
        userId: 'lexHeadTesting',
        contentType: 'audio/l16; rate=16000; channels=1',
        accept:"text/plain; charset=utf-8",
        sessionAttributes:{}
    };

    recording.stderr.on('data', function(data) {
        if (!streaming) {
            streaming = true;
            stream = ts.createReadStream(file);
            params.inputStream=stream 
            
            result=lexruntime.postContent(params).promise()
        }
    });

    recording.on('close',()=>stream.done())
    
    return new Promise(function(res,rej){
        recording.on('exit',function(){
            streaming=false
            exec(REMOVE_REQUEST_FILE).on('exit',()=>res(result))
        })
    })
}
