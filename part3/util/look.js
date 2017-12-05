var exec = require('promised-exec')
var aws=require('./aws')
var bucket="rekognition-demo-jcalho"
var name="image.png"
var collection="demo"
var player=require('./play')
var Promise=require('bluebird')
var _=require('lodash')
var snap=require('./snap')
var rek=new aws.Rekognition({
    params:{Image:{S3Object:{
        Bucket:bucket,
        Name:name
    }},
        CollectionId:collection
    }
})


exports.image=function(){
    var image=__dirname+'/'+name
    
    var take=snap(image)            
    .then(()=>exec("aws s3 cp "+image+" s3://"+bucket))
    
    take.then(()=>exec("rm "+image))

    return Promise.join(
        take,
        player.play(_.sample([
            'let me look',"ok","lets see","i'll look"
        ]))
    )
}

exports.labels=function(){
    return Promise.join(
        rek.detectLabels({}).promise().get('Labels'),
        fill()
    ).get(0)
}

exports.faces=function(){
    return Promise.join(
        rek.detectFaces({
            Attributes:["ALL"]
        }).promise().tap(console.log).then(x=>x.FaceDetails[0]),
        Promise.resolve()
    ).get(0)
}

exports.many=function(){
    return Promise.join(
        rek.detectFaces({
            Attributes:["ALL"]
        }).promise()
        .then(x=>x.FaceDetails.length),
        Promise.resolve()
    ).get(0)
}

exports.remember=function(name){
    return Promise.join(
        rek.indexFaces({
            ExternalImageId:name
        }).promise(),
        fill()
    ).get(0)
}

exports.recall=function(){
    return Promise.join(
        rek.searchFacesByImage({
        }).promise().get('FaceMatches'),
        fill()
    ).get(0)
}

function fill(){
    return player.play(_.sample([
        "hm","well"
    ]))
}


