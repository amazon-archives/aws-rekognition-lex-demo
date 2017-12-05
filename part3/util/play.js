var aws=require('../util/aws')
var Player=require('player')
var Promise=require('bluebird')
var fs=Promise.promisifyAll(require('fs'))
var tmp=require('tmp')
var exec = require('promised-exec')
var hash=require('hasha')
exports.name="Joanna"
var polly=new aws.Polly({params:{
    OutputFormat: "mp3", 
    SampleRate: "16000", 
    TextType: "text", 
    VoiceId:exports.name
}})

var ready=new Promise(function(res,rej){
    tmp.dir({unsafeCleanup:true},function(err,path){
        return err ? rej(err) : res(path)
    })
})
exports.voice=function(name){
    exports.name=name
    polly=new aws.Polly({params:{
        OutputFormat: "mp3", 
        SampleRate: "16000", 
        TextType: "text", 
        VoiceId:exports.name
    }})
}

exports.play=function(text){
    var name=hash(text+exports.voice)
    var file
    console.log(text)
    return ready.then(function(path){
        file=path+'/'+name+'.mp3'
        return fs.accessAsync(file)
    })
    .catch(err=>err.code === 'ENOENT',function(){
        return polly.synthesizeSpeech({
            Text:text, 
        }).promise()
        .get('AudioStream')
        .then(function(stream){
            return fs.writeFileSync(file,stream)
        })
    })
    .then(()=>exec("afplay "+file))
}
