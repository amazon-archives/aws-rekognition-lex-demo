#! /usr/bin/env node
var Promise=require('bluebird')
var record=require('./util/listen')
var config=require('./config')
var commands=require('./commands')
var player=require('./util/play')
var keypress=require('./util/keypress')
listen()

function dispatch(params){
    var command=params.intentName
    console.log(params)
    if(command && commands[command]){
        return Promise.resolve(
            commands[command](params)
        )
    }else if(params.inputTranscript){
        return player.play("I dont understand")
    }
}

function listen(){
    record()
    .then(dispatch)
    .then(()=>listen())
    //.then(()=>keypress())
    .catch(console.log)
}



