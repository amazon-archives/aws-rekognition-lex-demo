var exec = require('promised-exec')
var Promise=require('bluebird')

module.exports=function(name){
    return Promise.resolve(exec('imagesnap -l').then(function(result){
        if(result.match('USB')){
            camera=' "USB 2.0 Camera" '
        }else{
            camera=' "FaceTime HD Camera" '
        }
        return exec('imagesnap -w 1 -d '+camera +name) 
    }))
}
